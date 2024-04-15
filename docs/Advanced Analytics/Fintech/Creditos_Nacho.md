---
title: Segmentación de clientes de Créditos
---

# Docu funcioncional de la segmentacion

## Introducción
La segmentación es una herramienta fundamental en el análisis de datos, que permite agrupar a los clientes de ac
La segmentación es una herramienta fundamental en el análisis de datos, ya que nos permite agrupar a los client

lorem ipsum


**Estado del cliente**

Definido por el estado de sus créditos

``` python
# Define una función para determinar el estado de los clientes
def determinar_estado_cliente(estado):
    if any(estado == 2):
        return 'Incobrable'
    elif any(estado == 3):
        return 'Legales'
    elif any(estado.isin([1, 6, 7])):
        return 'Activo'
    elif any(estado == 4):
        return 'Inactivo'
    else:
        print(estado)
        return "Error"

# Agrupar por número de cliente y aplicar la función de estado
df["ESTADO"] = df.groupby('CLIENTE_SK')['ESTADO_SK'].transform(determinar_estado_cliente)
```
