# Laboratorio 3:Programación asistida para Frameworks sobre Cálculo Distribuido

---
## Objetivo:
En este laboratorio vamos a re-implementar el lector automático de feeds del Laboratorio 2 sobre una arquitectura distribuida, a través del framework Spark, utilizando como lenguaje de programación Java. Además, vamos a aplicar diferentes aproximaciones para hacerlo: programación asistida por inteligencia artificial, ejemplos de proyectos tipo o consultas a sitios de referencia.

**Voy a documentar mi proceso para resolver el proyecto utilizando como estrategia chatGPT, una inteligencia artificial generativa orientada a diálogo general.**

---
# Proceso
---
Primero lo que debemos hacer es instalar Spark en nuestra maquina. Para ello le pregunte a chatGPT lo siguiente:

![Pregunta_1](Imagenes/preg_1.png)

Y obtuve como respuesta

![Respuesta_1_1](Imagenes/preg_1_R1.png)
![Respuesta_1_2](Imagenes/preg_1_R2.png)
![Respuesta_1_3](Imagenes/preg_1_R3.png)

Pero al realizar el punto 3 usando wget me tiro el siguiente error

![Respuesta_1_4](Imagenes/preg_1_R4.png)

Así que le pedí ayuda a chatGPT

![Respuesta_1_5](Imagenes/preg_1_R5.png)
![Respuesta_1_6](Imagenes/preg_1_R6.png)

Asi que modifique el numero de version con la ultima disponible en https://spark.apache.org/downloads.html

![Respuesta_1_7](Imagenes/preg_1_R7.png)

---
Luego le pregunté:

![Preguna_2](Imagenes/preg_2_.png)
![Respuesta_2_1](Imagenes/preg_2_R1.png)
![Respuesta_2_2](Imagenes/preg_2_R2.png)
![Respuesta_2_3](Imagenes/preg_2_R3.png)

---
Luego le hice la siguiente pregunta

![Pregunta_3](Imagenes/preg_3_.png)
Me dio una explicación utilizando un ejemplo simple, el cual lo pase a eclipse directamente para probarlo:

![Respuesta_3_1](Imagenes/preg_3_R1.png)
![Respuesta_3_2](Imagenes/preg_3_R2.png)

Pero al correrlo me tiraba la siguiente excepción
![Respuesta_3_3](Imagenes/preg_3_R3.png)
El cual al preguntarle a chatGPT
![Respuesta_3_4](Imagenes/preg_3_R4.png)
![Respuesta_3_5](Imagenes/preg_3_R5.png)

Primero lo que hice fue actualizar java a la versión 11 y la agregue a eclipse.
También fue necesario añadir los jars que se encuentran en el directorio de spark.
Intente correr el programa de nuevo y funciono:

![Respuesta_3_6](Imagenes/preg_3_R6.png)

Por otro lado, conversando con mis compañeros de grupo, me enseñaron otro código de ejemplo en el cual antes de poder correrlo había que crear un Maven project, crear un archivo log4.properties, un pom.xml y configurarlo con las dependencias correspondientes.
Como buena práctica y para minimizar posibles errores, lo incorpore a mi proyecto de ejemplo. Igualmente no obtuve ningún cambio que se pueda apreciar y siempre aparecian los mismos mensajes por consola:

![Respuesta_3_7](Imagenes/preg_3_R7.png)

Realice la siguiente consulta

![Respuesta_3_8](Imagenes/preg_3_R8.png)
![Respuesta_3_9](Imagenes/preg_3_R9.png)
![Respuesta_3_10](Imagenes/preg_3_R10.png)

Pero no me sirvió. Intenté muchas veces, preguntando de diferentes maneras, pero nada me ayudaba a solucionarlo. Hasta que pregunte lo siguiente:

![Respuesta_3_11](Imagenes/preg_3_R11.png)
![Respuesta_3_12](Imagenes/preg_3_R12.png)
![Respuesta_3_13](Imagenes/preg_3_R13.png)

Por suerte desaparecieron todos los mensajes de tipo INFO!

![Respuesta_3_14](Imagenes/preg_3_R14.png)

Así que le pregunte a chatGPT que hacia el código que estaba en log4.properties.

![Respuesta_3_15](Imagenes/preg_3_R15.png)
![Respuesta_3_16](Imagenes/preg_3_R16.png)

Y ahora puedo decir que esa es la estructura que debería tener un programa de conteo de palabras en diferentes documentos en Spark:

![Respuesta_3_17](Imagenes/preg_3_R17.png)


---
## ¿Cómo adaptar el código del Laboratorio 2 a la estructura del programa objetivo en Spark?

![Pregunta_4_](Imagenes/preg_4_.png)
![Respuesta_4_1](Imagenes/preg_4_R1.png)
![Respuesta_4_2](Imagenes/preg_4_R2.png)
![Respuesta_4_3](Imagenes/preg_4_R3.png)
![Respuesta_4_4](Imagenes/preg_4_R4.png)
![Respuesta_4_5](Imagenes/preg_4_R5.png)
![Respuesta_4_6](Imagenes/preg_4_R6.png)
![Respuesta_4_7](Imagenes/preg_4_R7.png)
![Respuesta_4_8](Imagenes/preg_4_R8.png)
![Respuesta_4_9](Imagenes/preg_4_R9.png)
![Respuesta_4_10](Imagenes/preg_4_R10.png)
![Respuesta_4_11](Imagenes/preg_4_R11.png)
Entonces fui realizando estas modificaciones en mi codigo.
![Respuesta_4_12](Imagenes/preg_4_R12.png)
![Respuesta_4_13](Imagenes/preg_4_R13.png)
Pero tenia un error:
![Respuesta_4_14](Imagenes/preg_4_R14.png)
Busque como solucionarlo
![Respuesta_4_15](Imagenes/preg_4_R15.png)
![Respuesta_4_16](Imagenes/preg_4_R16.png)
![Respuesta_4_17](Imagenes/preg_4_R17.png)
Pero como no obtuve una respuesta que me sirva, hice lo siguiente
![Respuesta_4_18](Imagenes/preg_4_R18.png)
(Compartiendole solo la parte del codigo que usa Spark)
![Respuesta_4_19](Imagenes/preg_4_R19.png)
![Respuesta_4_20](Imagenes/preg_4_R20.png)
![Respuesta_4_21](Imagenes/preg_4_R21.png)
![Respuesta_4_22](Imagenes/preg_4_R22.png)
![Respuesta_4_23](Imagenes/preg_4_R23.png)
![Respuesta_4_24](Imagenes/preg_4_R24.png)
![Respuesta_4_25](Imagenes/preg_4_R25.png)
![Respuesta_4_26](Imagenes/preg_4_R26.png)
Esto mismo fue tambien necesario para la clase NamedEntity

Logre correr el programa con la misma funcionalidad del lab 2, salvo por una excepción:
No contabiliza las entidades nombradas por categoria
| lab 2                                                                                                     | lab 3                                                                                                     |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ![Respuesta_4_27](Imagenes/preg_4_R27.png)                     | ![Respuesta_4_28](Imagenes/preg_4_R28.png)                     |

Esto sucede porque al crear la lista de entidades nombradas lo hago con null en vez de la categoria y topico correspondiente.
![Respuesta_4_29](Imagenes/preg_4_R29.png)
Intene resolverlo pero no hubo caso.

---
Para finalizar le hice una ultima pregunta a chatGPT
![Respuesta_5_](Imagenes/preg_5_.png)
![Respuesta_5_1](Imagenes/preg_5_R1.png)
![Respuesta_5_2](Imagenes/preg_5_R2.png)