# Análisis de flujo y congestión en redes utilizando simulación discreta

## Resumen:
En el siguiente informe estudiamos el fenómeno que se produce cuando a una red se le ofrece más tráfico del que puede manejar. Realizamos un análisis de este problema con una red simple que contiene un generador de paquetes, un resumidero y un enrutador que los conecta. Por otra parte, simulamos una red con problemas de flujo y otra con problemas de congestión para concluir que en ambos casos se produce el mismo fenómeno. Y para finalizar, proponemos una solución que pretende controlar el flujo durante la simulación, esto se obtiene notificando al generador de paquetes para que deje de transmitirlos.
## Introducción:
Una red es un conjunto de dispositivos que intercambian datos y recursos. Si en este proceso de intercambio se envían demasiados paquetes a la red, esta se congestionará y se degradará el desempeño a medida que se retrasen y se pierdan paquetes. Es importante comprender cómo la calidad del servicio de una red puede llegar a deteriorarse debido al tráfico, y cuales son los mecanismos que controlan a este.

El control de flujo es un mecanismo de adaptación de velocidades que controla el tráfico entre un nodo emisor y otro receptor, por lo que su objetivo es que el primer nodo no sature el buffer del segundo. Por otro lado tenemos el control de congestión, este método se utiliza cuando la red se encuentra en una situación en la cual los nodos intermedios de un camino llegan a un punto en el cual sus buffers locales se llenan de paquetes en espera y se ven obligados a rechazar paquetes entrantes. 

Debido a que es fundamental poder controlar la congestión y el flujo en la red para garantizar un buen servicio, realizamos un análisis de las situaciones que motivan el uso de estos mecanismos. Para lograr un estudio más completo, diseñamos y desarrollamos un modelo computarizado que nos permitió entender cómo se comporta la red en estas diferentes situaciones. En otras palabras, este proceso que realizamos es lo que llamamos una simulación. 

La red que nos importa estudiar y simular será muy básica, será aquella que tiene un componente que genera mensajes, otro que los recibe y un nodo intermedio que los conecta, es decir solo con lo necesario para comprender estos problemas de tráfico de datos. Ahora bien, un sistema cuyo estado cambia solo en ciertos puntos en el tiempo es lo que denominamos como sistema de eventos discretos. Este es el caso de nuestra red, ya que puede ser representada como una secuencia, por lo que nos interesa realizar una simulación de eventos discretos. Esta simulación tiene como objetivo describir cada evento, moviéndose de uno a otro, a medida que el tiempo transcurre.

Para esto utilizaremos la herramienta OMNeT++, esta es un entorno de simulación de eventos discretos basado en C++. En particular, operaremos con tres tipos de archivos: NED, INI, CC.  En el primer tipo de archivo definimos la red con la que vamos a trabajar, los diferentes nodos que están involucrados en la simulación y cómo se realiza la conexión entre ellos. Para definir los nodos utilizamos módulos y tenemos dos tipos de estos, módulos simples y compuestos. Nuestros módulos simples serán un generador de mensajes (gen) , una cola (queue) y un resumidero de mensajes (sink). 

Los módulos simples se implementan en el tercer tipo de archivo que mencionamos, los CC. En líneas generales cada módulo atenderá eventos o los generará para su módulo vecino. El módulo gen envía mensajes a través de su compuerta de salida y se programa para volver a repetir este proceso luego de un determinado tiempo (generationInterval). El módulo sink nos servirá para el análisis, ya que calcula cuántos paquetes llegaron al destino final y el tiempo que tardaron en lograrlo. Por último, el módulo queue atiende dos eventos. Cuando un paquete llega a la cola, esta se encarga de guardarlo en un buffer si es que no se encuentra totalmente lleno (bufferSize), en caso contrario lo rechaza y consideramos ese paquete como perdido. Adicionalmente se autoprograma para atender este paquete que acaba de recibir si no tiene otros previos. El otro tipo de eventos que atiende es cuando se le avisa que debe sacar un paquete del buffer, luego de eso se autoprograma para realizar este mismo proceso después de un determinado tiempo (serviceTime). Profundizaremos en la implementación de los módulos simples más adelante cuando se considere necesario para el análisis.

Los módulos compuestos contienen a los simples en su interior, estos serán nodeTx y nodeRx.  El esquema de esta red se ve de la siguiente forma:

![network_parte1](/imagenes_lab3/parte1/network_parte1.png)

Aquí nodeTx es el generador y nodeRx es el receptor. Ambos cuentan con una queue(buffer) local. Y la Queue simula una red(en este caso de un solo router). Una imagen de ambos módulos compuestos sería la siguiente:

![nodeTx_parte1](/imagenes_lab3/parte1/nodeTx_parte1.png)
![nodeRx_parte1](/imagenes_lab3/parte1/nodeRx_parte1.png)
![network_detallado_parte1](/imagenes_lab3/parte1/network_detallado_parte1.png)

Ahora bien, como nos interesa conocer la situación donde tenemos tráfico de datos debido al flujo o la congestión, estudiaremos dos casos distintos que representan estos momentos. Para lograr esto, los módulos de nuestra red se verán afectados por las variables “datarate” y “delay” que representan la tasa de transferencia del canal y el retardo de propagación respectivamente.

Otra variable que influirá nuestra simulación será la de “generationInterval” que determina cada cuanto tiempo vamos a generar un nuevo paquete. Esta tiene una distribución exponencial centrada en un valor x (segundos), por lo tanto la distribución del paquete no va a ser constante sino que va a ser aleatoria, con números alrededor de x. Para nuestro análisis tendremos tres valores distintos para x, estos serán 0.1, 0.15 y 0.2. Decidimos el uso de estos valores porque evidencian como la pérdida de paquetes va decreciendo a medida que retrasamos la generación de estos. Descartamos valores mayores porque no hay mejora con respecto al rechazo de paquetes ocasionado por un buffer lleno.

### Caso de estudio 1

NodeTx a Queue: datarate = 1 Mbps y delay = 100 us

Queue a NodeRx: datarate = 1 Mbps y delay = 100 us

Queue a Sink: datarate = 0.5 Mbps

![parte1_ce1_network](/imagenes_lab3/parte1/caso_estudio1/parte1_ce1_network.jpeg)

#### generationInterval = exponential(0.1)

Una vez que corrimos la simulación con estos valores, el entorno de simulación nos proporcionó los siguientes resultados.

![parte1_ce1_vectores01](/imagenes_lab3/parte1/caso_estudio1/exp01/parte1_ce1_vectores01.png)

Este archivo detalla los valores asociados a distintos vectores que se manejan en los módulos. Explicaremos la utilización de los mismos en esta sección y la recordaremos en los futuros análisis.

Enviados: contabiliza los paquetes generados y enviados al buffer del transmisor.

bufferSize: contabiliza cuántos paquetes se almacenaron en el buffer de cada nodo.

Usados: contabiliza paquetes que efectivamente llegaron al sink.

Perdidos: contabiliza paquetes rechazados por algún buffer saturado.

Delay: contabiliza la veces que se calculó el tiempo que tarda un paquete en crearse hasta que efectivamente llega al sink.

Ahora bien, durante los 200 segundos que dura la simulación obtuvimos un total de 1979 paquetes generados y enviados al buffer del transmisor. Como es de esperarse, tenemos el mismo número de paquetes para el buffersize del transmisor. Notar que en promedio este buffer mantiene 13 paquetes en espera. Luego cuando este buffer termina de procesar el paquete, lo envía al buffer de la red con un retardo de propagación de 1Mbps. A este buffer solo llegaron 1970 paquetes, los restantes no llegaron al mismo debido a que la simulación se cortó en el momento que se estaban mandando estos paquetes que ya habían sido generados. Lo interesante para analizar es que en el buffer del receptor solo se almacenaron 1199 de los 1970 que se mandaron de la queue de la red. Notamos que no llegaron 771 paquetes, de los cuales 770 fueron rechazados como se registra en el vector de ‘perdidos’. Por otra parte de estos 1199 que tenemos en el buffer del receptor, solo 998 llegaron finalmente al sink. Para comprender por qué sucede esto comparemos los búferes de los distintos nodos.

![parte1_ce1_buffersocupados01](/imagenes_lab3/parte1/caso_estudio1/exp01/parte1_ce1_buffersocupados01.png)

En primer lugar tenemos que en el bufer de Tx la cantidad de paquetes que almacena varía debido al generationInterval. Por otro lado, el bufer de la red se mantiene constantemente en 1 ya que la velocidad a la que recibe paquetes, es la misma a la que los transmite, por lo que nunca tendremos más de un paquete en espera. Finalmente el bufer del receptor tiene una cantidad de paquetes que aumenta en el tiempo, alcanzando un estado en el que se satura almacenando 200 paquetes, a partir de ese momento empieza a rechazar. Llegamos a esta situación porque el bufer receptor recibe paquetes al doble de la velocidad que los transmite. Este problema es de flujo como mencionamos anteriormente. 

Cuando la simulación termina, el bufer receptor sigue saturado, teniendo en su interior los 200 paquetes, esto explica la diferencia de los 1199 paquetes en el bufer del receptor con los 998 que llegaron al sink. Finalmente el siguiente gráfico resume el resultado del problema explicado.

![parte1_ce1_ult01](/imagenes_lab3/parte1/caso_estudio1/exp01/parte1_ce1_ult01.png)

#### generationInterval = exponential(0.15)

![parte1_ce1_vectores15](/imagenes_lab3/parte1/caso_estudio1/exp15/parte1_ce1_vectores15.png)

En este caso resaltamos primero la cantidad de paquetes enviados en 200 segundos, claramente es menor al caso anterior debido a que tardamos más en generar los paquetes. Esta velocidad de generación también afecta a la pérdida de paquetes, ya que el bufer del receptor tardará más en recibirlos, pues primero se deben generar, pero tarda lo mismo que antes en sacarlos. 

![parrte1_ce1_buffersocupados15](/imagenes_lab3/parte1/caso_estudio1/exp15/parrte1_ce1_buffersocupados15.png)

Notamos que el buffer receptor vuelve a saturarse, pero tarda más que antes en llegar a este estado y si bien genera pérdidas, ya no tenemos tantas como antes. El bufer del transmisor tiene un promedio de 1.57 paquetes almacenados simultáneamente, nuevamente esta disminución se debe a que los paquetes se generan con menos frecuencia que antes. 

![parte1_ce1_ult15](/imagenes_lab3/parte1/caso_estudio1/exp15/parte1_ce1_ult15.png)

generationInterval = exponential(0.2)

![parte1_ce1_vectores02](/imagenes_lab3/parte1/caso_estudio1/exp02/parte1_ce1_vectores02.jpeg)

Finalmente para este caso se logra evitar los paquetes perdidos. Era de esperarse debido a los resultados del caso anterior, y por que cada vez retrasamos la generación de nuevos paquetes. Si bien tenemos una diferencia entre los paquetes que se encuentran en la cola del receptor y los que efectivamente llegan al sink, esto ocurre porque quedaron paquetes en este último buffer y no llegaron a ser transmitidos, podemos ver este resultado en la gráfica.

![](/imagenes_lab3/parte1/caso_estudio1/exp02/parte1_ce1_buffersocupados02.png)

Como resultado final, vemos la diferencia entre enviados y recibidos notando la mejora en la proporción de paquetes que llegaron al destino.

![parte1_ce1_ult02](/imagenes_lab3/parte1/caso_estudio1/exp02/parte1_ce1_ult02.png)

Antes de continuar con el caso de estudio 2, nos gustaría presentar el siguiente gráfico que muestra la carga útil como función de la carga ofrecida.

![cargautil_vs_cargaofrecida](/imagenes_lab3/parte1/cargautil_vs_cargaofrecida.jpeg)

Notamos que cuando la distribución exponencial está centrada aproximadamente en valores mayores a 0.2, la carga útil es proporcional a la carga ofrecida. Esto ya lo habíamos mencionado y fue una de las motivaciones para no elegir una distribución centrada en valores mayores a 0.2. Ahora bien, cuando la distribución se centra en valores cada vez más pequeños, los paquetes se generan con mayor velocidad y el receptor no es capaz de manejar tal cantidad, es por eso que la carga ofrecida se estanca porque el buffer y su velocidad limitan la red.

### Caso de estudio 2

NodeTx a Queue: datarate = 1 Mbps y delay = 100 us

Queue a NodeRx: datarate = 0.5 Mbps y delay = 100 us

Queue a Sink: datarate = 1 Mbps

![parte1_ce2_network](/imagenes_lab3/parte1/caso_estudio2/parte1_ce2_network.jpeg)

Nuestro otro caso de estudio tiene una diferencia en la tasa de transferencia del canal, se recomienda ver la figura que se presenta cuando se comienza cada caso de estudio para poder visualizar el cambio.

#### generationInterval = exponential(0.1)

Una vez preparada la simulación, corrimos la misma y obtuvimos los siguientes resultados:

![parte1_ce2_vectores01](/imagenes_lab3/parte1/caso_estudio2/exp01/parte1_ce2_vectores01.jpeg)

Podemos observar resultados similares a los obtenidos en la simulación del caso 1, pero esta vez distinguimos que el vector de ‘perdidos’ ocurre en la queue de la red, no en el receptor como ocurría antes. Pues ahora es la queue de la red la que recibe en el doble de la velocidad de la que puede transmitir. De igual manera, la proporción entre paquetes enviados y recibidos es análoga a la del caso 1.

#### generationInterval = exponential(0.15)

![parte1_ce2_vectores15](/imagenes_lab3/parte1/caso_estudio2/exp15/parte1_ce2_vectores15.jpeg)

Aquí obtenemos nuevamente un descenso en la cantidad de paquetes perdidos, logrando una mejor proporción entre paquetes enviados y recibidos.

#### generationInterval = exponential(0.2)

![parte1_ce2_vectores02](/imagenes_lab3/parte1/caso_estudio2/exp02/parte1_ce2_vectores02.jpeg)

Por último, ya no se presenta la pérdida de paquetes y se comparten los resultados finales de este caso con los obtenidos en el caso 1.

Recordemos la motivación de estos estudios y examinemos las similitudes y diferencias entre ambos. Nos interesaba conocer el tráfico en una red y como esta perdía calidad en sus servicios de entrega debido a la pérdida de paquetes. En ambos casos capturamos este fenómeno con los mismos resultados, pero este suceso ocurrió en distintos sitios de la red. Como ya habíamos anticipado, tenemos problemas que se solucionan controlando la congestión y el flujo de la red. Por un lado debemos controlar la congestión porque tenemos un problema en el enrutador, aquí es el buffer de la red el que rechaza los datos. Y por otro lado, debemos controlar el flujo porque se manejan diferentes velocidades entre el nodo emisor y el receptor, pues aquí es la velocidad de enviar datos que tiene el buffer del receptor la que limita y ocasiona las pérdidas. Este último problema nos incentiva a buscar una solución que reduzca la proporción de paquetes pérdidos, y que elementos deberíamos añadir a nuestra red para lograr lo mismo.


## Métodos:

Para resolver el problema de paquetes perdidos una solución sería modificar el generationInterval cuando la red se encuentre en un estado vulnerable. Esta idea surge de la conclusión a la que llegamos con los casos estudiados, por lo que confiamos en una mejora en la proporción de paquetes enviados y recibidos. Ahora bien, esta solución reduce la cantidad de paquetes perdidos porque son menos los paquetes que se generan. 

Para evitar tener que reducir la cantidad de paquetes generados para obtener mejoras, implementemos la siguiente idea:

Necesitamos un algoritmo que pueda frenar la transmisión de paquetes cuando el buffer esté cerca de saturarse. Para ello se puede mantener una variable con la disponibilidad restante que tiene el buffer del receptor. Esta variable debería ser notificada al emisor para que este regule sus envíos. Cuando el emisor es notificado, queremos que no envíe paquetes a la red (queue de la red) si no que los mantenga en su cola hasta que el buffer del receptor se encuentre más liberado. 

De esta idea sospechamos mejoras con respecto a la cantidad de paquetes perdidos. Pues no van a llegar paquetes al buffer del receptor si éste notificó su estado. El emisor con el conocimiento de la situación podrá tomar la decisión de enviar los paquetes o reservarlos, evitando así saturar un buffer y controlando el flujo

## Resultados:
Implementar nuestra solución requerirá de nuevos elementos en la red. Necesitamos un nuevo tipo de paquete, uno que informe el estado de la red, este será el paquete feedback que en su interior almacenará la disponibilidad actual del buffer del receptor. Para transmitir este paquete necesitamos otro canal, uno exclusivo para notificar su variable almacenada. Este nuevo diseño nos lleva a modificar las queue del emisor y del receptor, para esto creamos dos clases nuevas, una será TransportTx (emisor) y la otra será TransportRx (receptor). Las siguientes imágenes muestran la red con los nuevos elementos.


![network_parte2](/imagenes_lab3/parte2/network_parte2.jpeg)

![network_detallado_parte2](/imagenes_lab3/parte2/network_detallado_parte2.jpeg)

TransportRx: Este módulo simula ser una queue y maneja dos tipos de paquetes, uno de datos y otro de feedback. TransportRx se conecta con sink, queue0 y queue1. Lo que hace es recibir los paquetes de datos de la queue0, los almacena y luego los envía a sink. Lo interesante que hace este módulo es que por cada paquete que envía al sink, crea un paquete tipo feedBack, setea su variable con el tamaño actual del buffer y la manda por el nuevo canal para notificar al TransportTx.

TransportTx: En este módulo lo que queremos hacer es simular el comportamiento de una queue, pero este posee más compuertas. TransportTx está conectado al Gen, a queue1 y, por último, se conecta con queue0. Este módulo recibe datos del Gen y los transmite a queue0 solo si es posible. Es decir, cada vez que llega un paquete de tipo feedback, actualizamos el valor de una variable ‘capacidad’ con el valor que tenía este paquete. ‘capacidad’ nos servirá cuando este módulo tenga la tarea de enviar un paquete a la red, pues antes comprobará que ‘capacidad’ sea mayor a 2, solo en ese caso realizará la transmisión. Este número fue elegido por los casos estudiados con anterioridad, pues la queue de la red siempre se mantenía en 1, por lo que un número superior no generaría problemas. Si la capacidad es menor a 2, el TransportTx no transmitirá el paquete y esperará hasta que un nuevo feedback modifique la ‘capacidad’.
	
Una vez preparado el entorno de simulación con los nuevos cambios, corrimos y obtuvimos los siguientes resultados.

#### generationInterval = exponential(0.1)

![parte2_vectores01](/imagenes_lab3/parte2/exp01/parte2_vectores01.jpeg)
![parte2_buffersocupados01](/imagenes_lab3/parte2/exp01/parte2_buffersocupados01.png)

Notamos que la cantidad de enviados y la cantidad de usados (es decir, los que efectivamente fueron recibidos en el sink) es la misma a la que tuvimos en nuestros primeros estudios. Esto se debe a que no modificamos la generación de paquetes, y la velocidad que maneja el buffer del receptor sigue siendo la misma que antes. La diferencia aquí es que no tenemos paquetes pérdidos. Viendo la gráfica destacamos que cuando el buffer de Rx se acerca a 200, en ese momento el emisor fue notificado y empieza a almacenar en su buffer los paquetes que deben esperar.

#### generationInterval = exponential(0.15)

![parte2_vectores15](/imagenes_lab3/parte2/exp15/parte2_vectores15.jpeg)

![parte2_buffersocupados15](/imagenes_lab3/parte2/exp15/parte2_buffersocupados15.png)

 Igual que en los primeros estudios, ahora tenemos menos paquetes generados y por ende el emisor será notificado mucho después que el buffer del receptor se está por saturar.

#### generationInterval = exponential(0.2)

![parte2_vectores02](/imagenes_lab3/parte2/expp02/parte2_vectores02.jpeg)

![parte2_buffersocupados02](/imagenes_lab3/parte2/expp02/parte2_buffersocupados02.png)
	
Aquí el buffer del emisor se utiliza mucho menos que antes ya que los paquetes se generan con menor frecuencia.

## Discusión:
El algoritmo propuesto soluciona el problema de paquetes perdidos durante la simulación. Se podrían realizar otros tipos de cambios para que esto se sostenga en una simulación de más larga duración. Por otra parte, como ya mencionamos, el algoritmo controla el flujo pero no la congestión. En posteriores trabajos se podrían tratar ambos problemas, logrando una red más estable para diferentes situaciones.

## Referencias
https://omnetpp.org/documentation/

https://colab.research.google.com/drive/1_uT3BfnePUV1L-NAM0qmzWjLNb4xTUsB?usp=sharing

Redes De Computadoras. Tanenbaum, WetheRall. 5ta edición.

