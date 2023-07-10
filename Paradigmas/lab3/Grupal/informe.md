# Laboratorio 3: Programación asistida para Frameworks sobre Cálculo Distribuido

## Integrantes:
- Lucía Daniela Lotumolo Sueldo
- Nicolas Xynos 
- Juan Ignacio Mendez

## Resumen:
En el siguiente informe comparamos las estrategias utilizadas en el aprendizaje de las funcionalidades de Spark. Adicionalmente vamos a incorporar en nuestra aplicación la posibilidad de Recuperar los documentos que contengan una determinada palabra, ordenados desde el documento que tiene la mayor cantidad de ocurrencias de la misma al documento que tiene la menor cantidad de ocurrencias. Para ello creamos un índice invertido.

## Introducción:
Para lograr las funcionalidades de la entrega individual utilizamos diferentes estrategias, por un lado se utilizó un chat de inteligencia artificial, ChatGPT, y por otro lado se utilizaron búsquedas en la internet en general. Si bien pudimos alcanzar los objetivos, podemos comparar los métodos utilizados.
Primero hablemos de la búsqueda en internet. Al buscar ejemplos de aplicaciones Spark, habían muchas páginas con código de ejemplo. Usar eso como base sirvió como inspiración para llegar al código final. La ventaja principal en este aspecto es que fue de gran aprendizaje ya que se tuvo que ir comprendiendo y modificando el código inicial para alcanzar el objetivo de nuestra aplicación.
Para problemas más puntuales recurrimos a soluciones que se proporcionaban en sitios de preguntas y respuestas como StackOverflow. Buscar una solución en este sitio sirvió para desarrollar una mentalidad analítica y abierta a otras ideas o manera de hacer las cosas.
A partir de soluciones proporcionadas en sitios de preguntas y respuestas, se podría profundizar en el tema al realizar búsquedas en internet. Esta nos entregaba páginas con detalles que cubrían lo necesario, pero además iban más allá, lo que consideramos que fue muy provechoso en lo que se refiere al aprendizaje del asunto.
Si bien el aprendizaje obtenido valió la pena, se tuvo que invertir mucho tiempo. Si consideramos esto como desventaja, una propuesta sería cambiar la estrategia utilizada. Aquí es donde entra ChatGPT que funcionó muy bien para realizar este proyecto que utilizaba un framework. Pues, como en este tipo de aplicaciones tenemos patrones con algunas variaciones, las AI pueden detectarlos y reproducirlos.
De esta estrategia por lo tanto destacamos la velocidad en generar respuestas adaptadas. Fue muy sencillo de utilizar, y ahorró tiempo en estar navegando por la web en busca de una respuesta exacta para nuestra pregunta. Funcionó de gran manera cuando especificamos que necesitábamos hacer y cómo. 
Algo que también notamos fue que ChatGPT nos brindaba información incorrecta de manera convincente, sin embargo luego reconocía su confusión, actitud que no podíamos obtener de Google.
Ahora bien, interactuamos con ChatGPT tanto en español como en inglés, y aquí vemos otra diferencia. En algunas situaciones nos podía proporcionar código en español, pero este se obtuvo de su equivalente en inglés, lo que puede generar errores. Pues la calidad de las traducciones no será nunca como la de las traducciones humanas, ya que se realizaban traducciones literales, sin tener en cuenta el contexto.
Con estas diferencias en cuenta, tenemos que priorizar algún aspecto para decidir qué estrategia vamos a seguir utilizando para el desarrollo de nuestra aplicación. Basamos nuestra decisión en que, al utilizar un framework, vimos que ChatGPT podía comprender rápidamente nuestro código y modificarlo para nuestras necesidades. También optamos por utilizarlo en español ya que nos resultaba más cómodo para hacer preguntas puntuales.

## Solución:
Para hacer la parte de código versión grupal reutilizamos un proyecto individual y realizamos las modificaciones necesarias para incorporar la nueva funcionalidad.
Para empezar le proporcionamos a ChatGPT nuestro FeedReaderMain para que pueda darnos una respuesta de acuerdo a nuestro contexto. Luego de eso le pedimos:
Recuperar los artículos que contengan una determinada palabra (que le voy a pasar por consola como argumento), Para hacerlo es necesario crear un índice invertido de la colección de artículos.
Si bien Chatgpt nos proporcionó un código útil como base, tuvimos que ir ajustándolo para utilizar las funcionalidades de spark.
En resumen, fue necesario crear una lista de HashMaps (una por cada feed) donde las claves son todas las palabras del feed sin repeticiones y cada clave tiene como valor una lista de los artículos donde aparece esta palabra, ordenados de mayor a menor según la cantidad de ocurrencias.
Una vez obtenida esta estructura, solicitamos al usuario que nos proporcione por consola la palabra de la que desea obtener los títulos de los artículos en los que aparece.
Para ellos iteramos sobre esta lista, y accedemos al valor asociado a la clave (palabra proporcionada por el usuario) obteniendo la lista de artículos para mostrar sus correspondientes títulos por pantalla.
Un inconveniente que notamos fue que realizamos todo este procedimiento por ejecución cada vez que se realizaba una búsqueda.
La solución para no desaprovechar las hash tables ya creadas e inicializadas y mejorar la interacción del usuario, fue que una vez que obtenemos la lista de HashMap, en un bucle infinito ofrecemos esta opción "Ingrese una palabra para buscar en los artículos (o 'salir' para terminar): ", si el usuario ingresa una palabra el programa hace lo mismo que antes pero ni bien muestra por pantalla los títulos, vuelve a darle la opción de elegir una palabra, y así hasta que elija "salir".
