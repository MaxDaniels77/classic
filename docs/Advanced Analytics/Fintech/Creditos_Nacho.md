---
title: Segmentación de clientes de Créditos
---
# Segmentación de clientes de créditos

## Descripción del Proyecto

Este proyecto tiene como objetivo segmentar clientes de créditos utilizando datos extraídos de diversas tablas de la base de datos `EDW`. La segmentación se basa en múltiples criterios, incluyendo el historial de créditos, información personal del cliente, detalles sobre compras no relacionadas con créditos, medios de pago utilizados, y patrones de compra.

La importancia de este proyecto radica en la capacidad de identificar diferentes grupos o segmentos de clientes, lo que permite una mejor gestión de las relaciones con los clientes y la optimización de estrategias.

## Características del Proyecto

- **Extracción de datos**: Integración y limpieza de datos de múltiples fuentes dentro de la base de datos `EDW`.
- **Determinación de variables**: Generación de nuevas variables de cliente.
- **Análisis exploratorio**: Identificación de patrones y correlaciones relevantes entre las diferentes variables.
- **Modelado de segmentación**: Utilización de técnicas estadísticas y de aprendizaje automático para la segmentación efectiva de los clientes.
- **Salida**: Generación de una nueva tabla en la base `EBA`, donde cada fila representa un cliente y cada columna representa diferentes variables.


## Extracción de datos

Se utiliza la información proveniente de las siguientes tablas de EDW:

+ **FT_CREDITOS**: Contiene toda la información relacionada con los créditos emitidos a los clientes
+ **FT_COBROS_CREDITOS_NEW**: Detalla cómo se pagan las cuotas de los créditos otorgados
+ **FT_PW_CYBER**: Contiene información del tipo de tarjeta usada por el cliente.
+ **MV_FT_VENTAS_MIX_LIBRE**: Registra todas las compras realizadas por los clientes, tanto con créditos como sin ellos.
+ **DM_CLIENTES**: Proporciona información demográfica y de contacto de cada cliente.
+ **DM_PRODUCTOS**: Contiene detalles de cada artículo, especificando a qué rubro pertenece.

## Variables

### Variables generales

+ `FECHA_FOTO_SK`: Fecha del análisis
+ `CLIENTE_SK`: Clave única para cada cliente.


### Variables de crédito

+ `ESTADO_ACTIVIDAD_SK`:
Activo si tiene al menos un crédito activo, sino es Inactivo.
+ `ESTADO_LEGALES_INCOBRABLES_SK`:
Si posee algún crédito en legales o en estado incobrable.
+ `DEUDORES`: Indica si el cliente tiene deudas pendientes.
+ `CANT_CREDITOS_MORA`:  Número de créditos que el cliente tiene en mora.
+ `TRAMO_MORA_SK`: Meses de mora en su crédito más atrasado.
+ `TIPO_CLIENTE_CRED_SK`: Cliente de consumo, efectivo o ambos según sus créditos activos.
+ `TIPO_CLIENTE_HISTORICO`:
cliente de consumo, efectivo o ambos según todos los créditos.
+ `CANT_CREDITOS_ACTIVOS`
+ `CANT_CREDITOS`
+ `CANT_DINERO`: Monto total de dinero que el cliente ha pedido en créditos.
+ `PRORROGA`: Si posee prorroga en alguno de sus créditos
+ `NUEVO`: Si posee sólo un crédito y ese crédito está activo
+ `TIPO_COBRO_SK`: De qué manera paga las cuotas del crédito: Sucursal, virtual, externo u omnicanal.
+ `CATEGORIA_VIP_SK`: Clave que identifica si el cliente es considerado VIP
+ `RANGO_RECURRENCIA`: Cuantos meses pasaron entre que sacó su último crédito y dio de baja el anterior. 
+ `RENUEVA_ANTES_FINALIZAR`: Si sacó su último crédito antes de terminar de pagar el anterior.
+ `CUOTAS_PENDIENTES_CRED_RECIENTE`: Cuotas pendientes del crédito más reciente
+ `CUOTAS_PENDIENTES_CRED_ANTIG`: Cuotas pendientes del crédito más antiguo si posee más de uno



### Variables del cliente

+ `EDAD_SK`
+ `GENERO`
+ `MAIL`
+ `NOM_LOCALIDAD`
+ `TEL_PREFIJO`
+ `TEL_NUMERO`
+ `TARJETA_CREDITO`: Si compró alguna vez con tarjeta de crédito
+ `TARJETA_DEBITO`: Si compró alguna vez con tarjeta de debito
+ `CONTADO`: Si compró alguna vez de contado
+ `CATEGORIA_SK`: Categoría del cliente



### Variables de última compra no pagada con crédito

+ `FECHA_ULTIMA_CPRA_NO_CRDT`: Fecha de la operación
+ `FORMA_PAGO_AGRUP_SK`: Contado, tarjeta de crédito o débito.
+ `RANGO_MESES_ULT_CPR_SK`: Meses desde la última compra hasta la fecha de análisis.
+ `ARTICULO_ULT_CPRA_1`: Articulo más caro comprado.
+ `ARTICULO_ULT_CPRA_2`: Segundo articulo más caro comprado si compró más de uno.


## Definiciones

### Estado Renovador

+ 1 **Nuevo**: Sacó un crédito este mes y es su primer crédito
+ 2 **Ampliador**: Sacó un crédito este mes y tenia uno activo
+ 3 **Renovador**: Sacó un crédito este mes y era Potencial Renovador el mes anterior
+ 4 **Perdido**: Es inactivo este mes y el mes anterior era activo
+ 5 **Recuperado**: Sacó un nuevo crédito este mes y el mes anterior era A recuperar
+ 6 **Potencial Renovador**: Está en su última cuota o pagó la última cuota hace menos de un mes
+ 7 **Potencial Ampliador**: Tiene créditos activos y puede sacar uno nuevo
+ 8 **No Renovable**: Tiene créditos activos y no puede sacar uno nuevo
+ 9 **A recuperar**: Es inactivo y el mes pasado era inactivo



## Análisis exploratorio

## Modelo de segmentación

## Salida

