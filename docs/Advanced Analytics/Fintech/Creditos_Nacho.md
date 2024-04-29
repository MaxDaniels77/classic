---
title: Segmentación de clientes de Créditos
---

# Segmentación de clientes de créditos

El analisis se realiza una vez por mes. Se crean variables para cada cliente con la información de créditos, de pagos y otras compras.

## Obtención de datos

Se utiliza la información proveniente de las siguientes tablas de EDW:

+ FT_CREDITOS
+ FT_COBROS_CREDITOS_NEW
+ FT_PW_CYBER
+ MV_FT_VENTAS_MIX_LIBRE
+ DM_CLIENTES
+ DM_PRODUCTOS


## Variables de crédito

+ FECHA_FOTO_SK: Fecha del analisis
+ CLIENTE_SK 
+ ESTADO_ACTIVIDAD_SK:
Activo si tiene al menos un crédito activo, sino es Inactivo
+ ESTADO_LEGALES_INCOBRABLES_SK:
Si posee algún crédito en legales o en estado incobrable.
+ DEUDORES:
Si posee créditos atrasados de pago
+ CANT_CREDITOS_MORA
+ TRAMO_MORA_SK:
Meses de atraso en su crédito más atrasado
+ TIPO_CLIENTE_CRED_SK: Cliente de consumo, efectivo o ambos según sus créditos activos.
+ TIPO_CLIENTE_HISTORICO:
Cleinte de consumo, efectivo o ambos según todos los créditos.
+ CANT_CREDITOS_ACTIVOS
+ CANT_CREDITOS
+ CANT_DINERO
+ PRORROGA: Si posee prorroga en alguno de sus créditos
+ NUEVO: Si posee sólo un crédito y ese crédito está activo
+ TIPO_COBRO_SK: De que manera paga las cuotas del crédito: Sucursal, virtual, externo u omnicanal.
+ CATEGORIA_VIP_SK
+ RANGO_RECURRENCIA
+ RENUEVA_ANTES_FINALIZAR
+ CUOTAS_PENDIENTES_CRED_ANTIG
+ CUOTAS_PENDIENTES_CRED_RECIENTE


## Variables del cliente

+ EDAD_SK
+ GENERO
+ MAIL
+ NOM_LOCALIDAD
+ TEL_PREFIJO
+ TEL_NUMERO
+ TARJETA_CREDITO: Si compró alguna vez con tarjeta de crédito
+ TARJETA_DEBITO: Si compró alguna vez con tarjeta de debito
+ CONTADO: Si compró alguna vez de contado
+ CATEGORIA_SK



## Variables de última compra no pagada con crédito

+ FECHA_ULTIMA_CPRA_NO_CRDT
+ FORMA_PAGO_AGRUP_SK: Contado, tarjeta de crédito ó debito
+ RANGO_MESES_ULT_CPR_SK: Meses desde la última compra hasta la fecha de analisis
+ ARTICULO_ULT_CPRA_1: Articulo más caro comprado
+ ARTICULO_ULT_CPRA_2: Segundo articulo más caro comprado




