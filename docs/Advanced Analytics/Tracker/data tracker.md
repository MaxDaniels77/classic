---
title: Data funnel web
---

# Data funnel web

12/04/2024
## Objetivo

El objetivo de el funnel es representar de manera cómoda y detallada información sobre el comportamiento web de los clientes en la página de Frávega haciendo uso del tracker diseñado exclusivamente para ese uso, para esto daremos una explicacion una explicación general sobre como se obtiene y procesa la data que finalmente es depositada en **BigQuery** para ser levantada y graficada en un cubo **Microstrategy**. 


## Introducción tracker

El tracker web fue un desarrollo de del equipo de Julian Alonso, el cual levanta data de la web de Frávega y se encarga de enviarla a una serie de buckets en [Cloud Storage](https://console.cloud.google.com/storage/browser/fvgtech_web_traffic/tracker/staged;tab=objects?hl=es&prefix=&forceOnObjectsSortingFiltering=false&authuser=0). Estos buckets contienen distintas etapas de la data, ya sea la data en tiempo real, la data en estado staged y la que se utilizó particularmente en esta version, la data a dia cerrado que recibe el nombre de compressed (dado que se encuentra comprimida), veamos un ejemplo de la jerarquia:

![Buckets](./img/buckets.png)

Es necesario dar una breve introducción sobre dichos eventos:

* PageView: Es el evento que captura las urls de entrada y de salida asi como la metadata de la pagina como el dispositivo del cual se conecto el cliente, si llego de una campaña de marketing, etc. 
* DetailView: Este evento corresponde solamente al acto de observar un producto en particular, captura información como el producto que se esta observando, su precio, codigo de articulo,etc.
* AddToCart: Registra el acto de agregar un producto al carrito.
* RemoveFromCart: Registra  la eliminación de un producto del mismo.
* Order: Registra las ordenes de compra. Posee la particularidad de que si una compra se llega a caer, no registra la caida de esa compra, por lo que si bien posee ese detalle, es una cantidad muy pequeña.
* El resto de los eventos, si bien hay algunos importantes como listig, no fueron utilizados de momento.



Cada una de las carpetas en compressed corresponde a alguno de los eventos previamente comentados y dentro de ellas se encuentran los archivos comprimidos para cada dia y para cada horario en intervalos de 1 hora veamos un ejemplo de esto:

![Data por hora](./img/buckets_dias.png)
## Toma de los datos

Dada la jerarquida en la que tracker guarda los datos, se creo una libreria llamada `data_extraction`, la cual desde una notebook de **Vertex AI** se conecta a dicho bucket y levanta para un intervalo de tiempo arbitrario, la data de un set arbitrario de eventos, veamos un ejemplo de su uso:

``` python
# # Ejemplo de uso:
project_id = 'fvgtech-prd-analytics'
gcs_bucket = 'fvgtech_web_traffic'
start_date = datetime(2024, 3, 11)
end_date = datetime(2024, 3, 15)
eventos = ['PageView', 'DetailView','AddToCart','RemoveFromCart']  # Lista de eventos a procesar

blob_processor = BlobProcessor(project_id, gcs_bucket)
df = blob_processor.process_blobs(start_date, end_date, eventos)
display(df.head(),df.shape)
```
Dicha libreria busca obtener de manera arbitraria un subset relevante para el analisis de toda la informacion disponible en tracker los componentes principales de dicho subset son, para cada evento:
- PageView
  - session_id
  - cookie_id
  - referrer
  - base_url
  - original_url
  - ingestionTimestamp
  - clientTimestamp
  - utm_medium
  - utm_campaign
- DetailView
  - device
  - event_type
  - price
  - cod_articulo
  - geoAvailability_Availability
  - homeDelivery_Availability
  - homeDelivery_label
  - categorization
- AddToCart
  - Solo se trae la data para contar cuantos eventos hubo para cada session_id
- RemoveFromCart
  - Solo se trae la data para contar cuantos eventos hubo para cada session_id
- Orders:
  - Solo se trae la data para contar cuantas ordenes hubieron  para cada session_id. 

## Procesado de los datos

Acá va la descripción de como se preprocesaron los datos




## Mapeo de columas de salida

Al dia de la fecha, el dataset de salida cuenta con 111 columnas, antes de ver sus definiciones, repasemos las acciones [^aclaracion_evento] que vamos a considerar:

- Producto
- Listing
- Login
- Carrito
- Home
- Otro
- Shipping
- Mi Cuenta
- Email
- Payment
- Order


[^aclaracion_evento]: Se habla de acciones dado que usar **eventos** podria considerarse un abuso de notación, ya que eventos en si son aquellos que recolecta el tracker web. Sin embargo, es posible que se utilicen ambos casos, los cuales en su contexto son igualmente correctos. 


A partir de éstas, en su mayoría obtenias de parsear las columnas `referrer` y `base_rl`,
se generó el set de columnas finales, veamoslas por los grupos a los que pertenecen. 

Entendido, agruparé las columnas utilizando la estructura de separación por guiones bajos y, en los casos en que haya índices numéricos, los agruparé utilizando un índice general "i". Aquí está la lista modificada:

### User info:

En este grupo tenemos la información perteneciente al usuario, en ella, los `session_id` y los `cookie_id`  son claves únicas para identificar ya sea la cookie del usuario, como su sesión (la cual expira a la media hora de no registrarse actividad).
La única falencia de momento de esta clasificación es que no podemos saber si distintas cookies  son del mismo usuario o no lo son, ya que puede a priori conectarse de distintos dispositivos con distintas cookie_id. Dichas columnas son:

- navigation_step_session_id
- cookie_id

### Conjunto 1: Sesiones y Pasos de Navegación

En cada una de estas columnas tendremos de manera ordenada, el camino que fue desarrollado el usuario en el sitio web de frávega. En el primer paso tendremos el lugar al que aterrizo el cliente, dicho lugar es generado a partir de la data procesada de `base_url` transformada en las "acciones" o "eventos" comentados previamente. Un detalle de suma importancia a destacar es que no se obtienen todos los pasos, sino un subconjunto de los primeros 15 pasos. 

- **Pasoi** : Contiene el paso correspondiente dentro de la navegacion del usuario, i es un indice que va entre 1 y 15. Por ejemplo, un usuario en el Paso1 puede llegar a un **Listing**  y posteriormente en el Paso2 ir a un **Producto**. En el caso en que en el paso i-esimo, el cliente no haya registrado actividad, se reemplazará el Nulo con un `""` (un string vacio).
- **Sesiones_Pasoi**: Son todas las columnas con valores de i identicos a los pasos (del 1 al 15), que registran si en el paso i hubo actividad, en caso de que la haya colocan un 1, caso contrario un 0.
- **Pasos_Totales** : *Consultar con Ari* Registra la cantidad de pasos dentro del set de 15 pasos que  se tiene definido para representar la actividad web. No es el total pero sirve a modo indicativo. (Viene heredado de las primeras versiones)

### Conjunto 2: Conversiones y Sesiones por Producto:

- **convirtio** : Es un flag que indica si el cliente realizo una orden dentro de la sesion en cuestión.
- Sesiones_en_Producto
- Sesiones_en_Listing
- Sesiones_en_Home
- Sesiones_en_Otro
- Sesiones_en_Carrito
- Sesiones_en_Login
- Sesiones_en_MiCuenta
- Sesiones_en_Order
- Sesiones_en_Payment
- Sesiones_en_Shipping
- Sesiones_en_Email


- user_in_Landing



### Conjunto 3: Sesiones por Landing Page
- Sesiones_Landing_Producto
- Sesiones_Landing_Listing
- Sesiones_Landing_Home
- user_landing_in_Landing
- Sesiones_Landing_Otro
- Sesiones_Landing_Carrito
- Sesiones_Landing_Login
- Sesiones_Landing_Mi_Cuenta
- Sesiones_Landing_Order
- Sesiones_Landing_Payment
- Sesiones_Landing_Shipping
- Sesiones_Landing_Email

### Conjunto 4: Sesiones por Rebote
- Sesiones_Rebote_Producto
- Sesiones_Rebote_Listing
- Sesiones_Rebote_Home
- Sesiones_Rebote_Otro
- Sesiones_Rebote_Carrito
- Sesiones_Rebote_Login
- Sesiones_Rebote_Mi_Cuenta
- Sesiones_Rebote_Order
- Sesiones_Rebote_Payment
- Sesiones_Rebote_Shipping
- Sesiones_Rebote_Email
- Landing_Bound
### Conjunto 5: Ordenes por Landing Page
- Ordenes_Landing_Producto
- Ordenes_Landing_Listing
- Ordenes_Landing_Home
- Landing_purchased
- Ordenes_Landing_Otro
- Ordenes_Landing_Carrito
- Ordenes_Landing_Login
- Ordenes_Landing_Mi_Cuenta
- Ordenes_Landing_Order
- Ordenes_Landing_Payment
- Ordenes_Landing_Shipping
- Ordenes_Landing_Email

### Conjunto 6: Métricas de Tiempo y Páginas Visitadas
- Tiempo_Promedio
- Tiempo_Total
- Paginas_Visitadas
- Paginas_Visitadas_Producto
- Paginas_Visitadas_Listing
- Paginas_Visitadas_Home
- Paginas_Visitadas_Landing
- Paginas_Visitadas_Otro
- Paginas_Visitadas_Carrito
- Paginas_Visitadas_Login
- Paginas_Visitadas_Mi_Cuenta
- Paginas_Visitadas_Order
- Paginas_Visitadas_Payment
- Paginas_Visitadas_Shipping
- Paginas_Visitadas_Email

### Conjunto 7: Otros
- fecha
- cookie_id
- Cantidad_de_Add_to_Cart
- Cantidad_de_Remove_to_Cart
- Cantidad_de_Detail_View
- Cantidad_de_Listados
- Precio_Promedio_DetailView
- Origen_Agrupado
- Retiro_Inmediato
- Envio_Gratis
- Promesa_Entrega
- Categoria_Ingreso
- Categoria_Frecuente
- Tipo_Trafico

Espero que esta organización te sea útil para crear las descripciones que necesitas. Si hay algo más en lo que pueda ayudarte, ¡no dudes en decirlo!
