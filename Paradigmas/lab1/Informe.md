# **Informe**


## Integrantes:

    - Lucía Daniela Lotumolo Sueldo
    - Nicolás Xynos
    - Juan Ignacio Méndez



---
## **Experiencia**
---

Nuestra experiencia en este lab fue buena, tuvimos muchas situaciones donde nos trabamos y no sabíamos cómo seguir. Sobre el tramo final nos surgieron algunos problemas con los test porque no pudimos instalar HUnit por algunos errores y eso nos dificulto mucho verificarlos.  

  
---
## **Preguntas**
---
### **¿Por qué están separadas las funcionalidades en los módulos indicados? Explicar detalladamente la responsabilidad de cada módulo.**

Las funcionalidades están separadas ya que en el paradigma funcional es crucial separar bien la información de la interpretación. Separando en módulos queda más visible esta distinción.

En Dibujo.hs está la sintaxis de nuestro lenguaje, definimos como se escribe, y en este módulo nos encargamos de definir el tipo de dato Dibujo, junto con sus funciones que nos van a facilitar operar con este tipo de dato.

En Interp transformamos lo que decimos con palabras de nuestro nuevo lenguaje, devolviendo una interpretación con Gloss.


### **¿Por qué las figuras básicas no están incluidas en la definición del lenguaje, y en vez es un parámetro del tipo?**

Porque gracias a esto, podemos generalizar las funciones para cualquier tipo que queramos.
En cambio, si hiciéramos por ejemplo:
data Dibujo a = Figura Basica | Rotar (Dibujo Basica)|..|
data Basica = Triangulo | Circulo
estamos perdiendo abstracción y además, si en un futuro queremos modificar el tipo Basica, lo tendremos que hacer en cada instancia que usamos Triangulo o Circulo.
Y la idea es poder realizar distintos dibujos, cada uno de ellos seguramente va a tener distintas figuras Basicas, por lo que recién eso hay que tenerlo en cuenta en la implementación del propio dibujo.


### **¿Qué ventaja tiene utilizar una función de `fold` sobre hacer pattern-matching directo?**

La gran ventaja es que al usar fold no estamos utilizando directamente las funciones de nuestro lenguaje, por lo que si necesitamos modificar estas funciones, solo tenemos que hacerlo en Dibujo.hs.
Otra razón, es que varias funciones pueden devolver lo mismo, por lo que con `fold` nos ahorramos algunas líneas de código.
También, otra ventaja de usar fold sobre hacer pattern-matching es la modularización del código ya que podemos definir otras funciones utilizando fold, esto hace que el código quede más legible, sea menos repetitivo y utiliza el concepto de funciones de alto orden. 
Por otro lado, nos brinda cierta abstracción, más cuando trabajamos con una estructura de datos compleja.
Por ende consideramos que es una buena práctica de programación.