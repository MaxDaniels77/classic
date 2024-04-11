---
title: Limpieza salesforce
---

# En este manual voy a documentar la limpieza y como funciona:

### Primero algunos links de referencia

<ins>https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/DeleteByContactKeys.html</ins>

<ins>https://trailhead.salesforce.com/es/content/learn/modules/contact-management-solutions/evaluate-your-contacts</ins>

Este es importante es de donde sale el script que borra automaticamente:

[Contact Deletion in Marketing Cloud | Digital Marketing on Cloud](https://digitalmarketingoncloud.com/salesforce-marketing-cloud/contact-deletion-in-marketing-cloud/)

> Mail de la persona que me fue ayudando de salesforce : nquevedo@salesforce.com

## Consultas a realizar :

Que diferencias hay en esto?

WHERE DateUndeliverable is not null OR DateUnsubscribed is not null

# Caracterización del problema:

Hasta ahora si bien había algunos avances en el tema según entiendo comenzados por Juli Alonso y luego retomados por Alberto (ya no esta en fravega) hay varias cosas que no se implementaron las cuales comentaré mas adelante.

**En este caso lo que se busca es poder realizar una automatización del proceso de limpieza de la base:**

Si consideramos los avances previos, tenemos una automation de SF realizada por juli Alonso que lo que hace es obtener una tabla (Data Extension o  DE de ahora en adelante) que de las diversas fuentes que ingresan a Salesforce busca unificar en una DE ( de_all_contacts_v2) la información de todas estas personas en una única tabla.

Esta automation es útil para eliminar contactos de 3 medios carrito_y_sesion, otro_envio y sin_etiqueta. En orden de no perder tanto tiempo voy a optar por mantener lo que hicieron, aunque luego de hablar con Juli ambos estamos de acuerdo que tal vez no es lo mas optimo, pero como una primera iteración a una solución final creemos que es un buen comienzo.

En este caso, voy a editar una query anterior y agregar en una DE (A diferencia de antes que se hacia manualmente para cada una) para eliminar todos estos contactos de una

# Implementación

El primer paso para poder trabajar fue setear correctamente la Api. Esto puede consultarse en la documentación y fue realizado con ayuda del soporte de Salesforce. El nombre de la api Es "API" (En su descripción se aclara que es la de borrado de contactos). Esto puede verse en Setup-Apps-Installed Packages.

En su nivel mas básico, la implementación del proceso automatizado constara de los siguientes pasos:  
![814fc1942039c8698fa363aafcbab580.png](../_resources/814fc1942039c8698fa363aafcbab580.png)

En el caso de la validación, consistirá en que si la DE generada no tiene elementos, el proceso se detendrá automáticamente.

Este proceso será realizado para cada una de las DE consideradas y la ventaja es que será fácilmente ampliable.

## Distintos casos:

Los nombres de las automation corresponderán a **Cleaning-DA-Caso_bajo_analisis.** Veamos cada cada caso en particular:

### carrito_y_sesion, otro_envio y sin_etiqueta :

Una de las primeras DE a considerar será la que contenga los casos de **carrito_y_sesion, otro_envio y sin_etiqueta,** en este caso, se partirá de la siguiente consulta, realizada sobre la DE de_all_contacts_v2 que creo Juli Alonso. En este caso se partirá de una modificación a la consulta que habían generado antes, sobre la cual se modifico para que tome todos los casos (en lugar de hacerlo de manera individual para cada uno) y luego de acordarlo con Maria Eugenia Gogorza se estableció que todos los contactos de esos orígenes de mas de 3 meses de antiguedad serian eliminados, la consulta utilizada en este caso es la siguiente:

```SQL
SELECT
    t1.subscriberkey,
    t1.subscriber_emailaddress,
    t1.etiqueta,
    t1.subscriber_datejoin
FROM
    (SELECT
        subscriberkey,
        subscriber_emailaddress,
        cli_email,
        etiqueta,
        subscriber_datejoin
    FROM
        de_all_contacts_v2
    WHERE
        esta_en_all_contacts IS NOT NULL
        AND (
            etiqueta IN ('otro_envio', 'carrito_y_sesion', 'sin_etiqueta')
        )
        AND (ult_fecha_open < DATEADD(month, -3, GETDATE()) OR ult_fecha_open IS NULL)
    ) AS t1
```

Este proceso se realizara mensualmente, por lo que a lo sumo en la base se tendrían  al día previo a la ultima ejecución a lo sumo 4 meses menos 1 día de información de estos contactos.

### Hard Bounces:

Uno de los problemas mas grandes, era como eliminar los contactos inválidos, una manera inteligente de lidiar con este problema es la siguiente:

Salesforce al enviar un mail a algún contacto y éste rebotar, ya sea porque es invalido, la casilla este llena o sea el motivo que sea, guarda un contador de la cantidad de veces que dicho mail rebotó. Si filtramos a los mails que rebotaron alguna determinada cantidad de veces, habrán altas chances de estar atrapando a los mails que no son validos, ya sea en formato, que fueron mal cargados o que directamente no existen.   
El proceso anterior se complementa con el hecho de que las audiencias son sometidas a una prueba de formato antes de ser enviadas a Salesforce (Las cargadas manualmente por norma general). En el caso de las cargadas por Api, el proceso de momento no puede ser auditado aunque Julián comento que alguna consideración se tiene. El procedimiento es similar a lo anterior, donde la query utilizada sera:

```SQL
SELECT DISTINCT UPPER(s.EmailAddress) as Email,
s.SubscriberKey,
s.Status,
b.BounceCategory
FROM _Subscribers as s
INNER JOIN _Bounce as b
ON b.SubscriberKey = s.SubscriberKey
WHERE b.BounceCategory = 'Hard bounce'
```

Esta consulta tomará todos los Hard bounce o sea los rebotes duros y los Eliminará. En iteraciones posteriores se podrá definir con mas cuidado, pero para esta que será la primera se eliminaran todos con el objetivo de purgar lo mas posible la base de Emails inválidos:

### Emails nulos:

En este caso se buscara eliminar los casos en los que el email es nulo, cuando el suscriberKey no lo es

### Duplicados:

Esto en SF se considera como Subs duplicados

Para la eliminación de duplicados, se tiene la siguiente consideración, se buscan los duplicados en mail y se eliminaran en primera instancia los casos en los que el mail es igual a el suscriberKey o sea los casos donde se uso el mail como suscriberKey, este proceso eliminará la mayoría de duplicados problemáticos, luego se iterará para mejorar el proceso, la query utilizada para tal fin será la siguiente:

```SQL
SELECT TOP 500000 
    s.SubscriberKey, 
    s.EmailAddress 
FROM 
    _Subscribers s 
JOIN 
    [Duplicate Emails] de 
ON 
    de.EmailAddress = s.EmailAddress
where s.EmailAddress =  s.SubscriberKey
ORDER BY 
    s.EmailAddress, s.SubscriberKey
```

&nbsp;La ventaja de este proceso es que al mirar los duplicados, estamos seguros que al pedir la condición de que el mail sea igual al suscriberKey no nos estamos cargando usuarios únicos que fueron cargados con mail como sk.

La idea es aplicar este script de manera recursiva, e ir eliminando los duplicados quedándonos en ultima instancia 1 SK y su email asociado. El criterio será definido luego de una reunión con el área de marketing ya que la idea es que el SK sea el número de documento del suscriptor.

\## Data salesforce

mcj70-chhnnnv8g9ctbh0c-rbhjq.ftp.marketingcloudops.com puerto 22

Host: [mcj70-chhnnnv8g9ctbh0c-rbhjq.ftp.marketingcloudops.com](http://mcj70-chhnnnv8g9ctbh0c-rbhjq.ftp.marketingcloudops.com)  
Usuario: 10970005_6  
Contraseña: Danielaria$123

# Nota importante:

El proceso de eliminación, es definitivo. Si bien la data borrada se guarda en una DE que identificara el motivo de borrado, por ejemplo los Hard Bounces no es posible restaurarla dada su ubicación de origen por lo que se mantendrán durante el periodo mensual y luego serán eliminadas definitivamente al volver a ejecutarse la automation.

# Acá voy a guardar el código:

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

Lo primero es una

/\*  
`SSJS Code to call the Delete Contacts API based on a Data Extension.`  
`*/`

`<script language="javascript" runat="server">`  
`Platform.Load("core","1");`  
`var auth = HTTP.Post('https://mcj70-chhnnnv8g9ctbh0c-rbhjq.auth.marketingcloudapis.com/v2/token/', 'application/json', '{"grant_type": "client_credentials","client_id":"fy4ufs3abhsi1da0mlah8v2y","client_secret":"xNLdJVybbylmnWD1NlM1LIqE","account_id": "10964357"}');`  
`var authobj = Platform.Function.ParseJSON(auth.Response[0]);`  
`if (authobj.access_token) {`  
`var del = HTTP.Post(authobj.rest_instance_url+'contacts/v1/contacts/actions/delete?type=listReference', 'application/json', '{"deleteOperationType":"ContactAndAttributes","targetList":{"listKey":"BBD2A3CD-9746-4C40-8EB6-3E7AC2F4C700","listType":{"listTypeID":3}},"deleteListWhenCompleted":false,"deleteListContentsWhenCompleted":true}', ["Authorization"], ["Bearer " + authobj.access_token]);`  
`var delobj = Platform.Function.ParseJSON(del.Response[0]);`  
`if (delobj.hasErrors == false) {`  
`var de = DataExtension.Init("eeeeeeeeeeeeeeeeeeeeeeee");`  
`de.Rows.Add({ResponseDateTime:delobj.responseDateTime,RowCount:delobj.targetListInformation.rowCount});`  
`}`  
`};`  
`</script>`

&nbsp;

## Ventanas de tiempo
6 meses 