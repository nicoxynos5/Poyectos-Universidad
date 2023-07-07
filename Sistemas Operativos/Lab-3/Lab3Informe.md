# Informe Lab 3
## Grupo Milanesa
### Integrantes :
* Juan Cruz Oviedo
* Lucía Daniela Lotumolo Sueldo
* Nicolás Xynos
* David Litvinoff

### Introducción
En este laboratorio se analizó el funcionamiento de xv6, particularmente sus políticas de planificación. Luego, se realizaron mediciones para observar el comportamiento y rendimiento de dichas políticas y contrastarlas con el rendimiento tras la implementación de una multi level feedback queue de tres niveles de prioridad.

### Parte 1
Tras el estudio del código de xv6, se llegó a las siguientes conclusiones:
* La política de planificación por defecto de xv6 es la ejecución round robin de todos los procesos aptos a correr, sin ninguna distinción de prioridad.
* La duración del quantum es, en el caso específico de xv6, las misma que el tiempo entre tics del sistema. En este caso, 1000000 (un millón) de ciclos del cpu.
* El cambio de contexto en xv6, sin contar la llamada a swtch, dura 38 instrucciones o ciclos.
* No hay por defecto una forma de asignar menos tiempo de quantum a un proceso específico, ya que el intervalo entre ticks se declara globalmente.
* El cambio de contexto sí consume tiempo del quantum.

### Parte 2

En este experimento anhelamos comprender cómo se comporta el planificador Round Robin con distintas combinaciones de procesos, y también con una modificación en el quantum. Para esto ejecutaremos procesos cpu bound e io bound en una cantidad fija de ciclos para conocer la cantidad de operaciones que se realizan durante ese tiempo y poder ver la preferencia del planificador sobre los distintos tipos de procesos. Principalmente ansiamos ver cómo afecta una modificación en la frecuencia en la que un temporizador de hardware genera una interrupción, por lo que ya suponemos lo siguiente: Al modificar el quantum a un valor cada vez más chico, sobre los procesos ejecutados de forma solitaria esperamos un descenso en la cantidad de operaciones realizadas ya que tendremos cambios de contextos innecesarios y con eso decae el rendimiento. Luego, para una combinación de I/O bound y CPU bound esperamos una mejora en el tiempo de respuesta, al tener un tick apenas 10 veces más corto. Sin embargo, desconfiamos que un tick cada vez más pequeño mejore aún más lo antes mencionado, y esto se debe al costo fijo del context switch que seguirá influyendo en el rendimiento.

Experimento:
Para poder comparar los resultados al reducir la cantidad de ciclos por tick, vamos a aumentar cada cuanto imprimimos la cantidad de operaciones, de esta forma tendremos mediciones sobre el mismo número de ciclos de CPU.
	
Tick = 1.000.000	MINTICK = 100
Tick = 100.000		MINTICK = 1000
Tick = 10.000		MINTICK = 10000
Tick = 1.000		MINTICK = 100000

#### 1 CPUBENCH solo:
 Luego de ejecutar solo un cpubench obtuvimos distintas mediciones, calculamos la media y destacamos lo siguiente.

|                              | Promedio de la cantidad de operaciones |
|------------------------------|----------------------------------------|
| Quantum por defecto          | 8128                                   |
| Quantum 10 veces más corto   | 8211                                   |
| Quantum 100 veces más corto  | 7576                                   |
| Quantum 1000 veces más corto | 5004                                   |

![Caso_1](/images/1 cpubench solo.png)

Podríamos afirmar que a medida que achicamos la cantidad de ciclos por tick no podemos amortizar de manera eficiente el costo computacional que conlleva cambiar de contexto. Notamos como este mecanismo va dominando la CPU en cada modificación del quantum, reduciendo así la cantidad de operaciones realizadas. 	
	Luego cuando ejecutamos dos cpu bound en paralelo, esperaríamos lo mismo con respecto al context switch y la mitad de cantidad de operaciones ya que vamos a compartir la CPU, sin embargo los resultados no reflejan lo esperado, y notamos que se comporta muy parecido a ejecutar 1 solo cpubench.

| Caso 4: 1 cpubench 1 cpubench | cpubench 1 | cpubench 2 |
|-------------------------------|------------|------------|
| Quantum por defecto           | 9326       | 9648       |
| Quantum 10 veces más corto    | 960        | 958        |
| Quantum 100 veces más corto   | 41         | 45         |
| Quantum 1000 veces más corto  | 1          | 1          |

#### 1 IOBENCH solo:

| Caso 0: 1 iobench            | Promedio de la cantidad de operaciones |
|------------------------------|----------------------------------------|
| Quantum por defecto          | 8128                                   |
| Quantum 10 veces más corto   | 8211                                   |
| Quantum 100 veces más corto  | 7576                                   |
| Quantum 1000 veces más corto | 5004                                   |

![Caso_0](/images/Caso 0_ 1 iobench solo.png)

A diferencia del cpubench, el context switch no es protagonista. Esto se debe a que este tipo de procesos usa una pequeña parte del Quantum y luego cede la CPU, logrando así que el tiempo de sobra sea útil para amortizar el costo fijo del cambio de contexto.

#### 1 IOBENCH 1 CPUBENCH
Ahora veremos la ejecución de dos procesos distintos en paralelo, destacando la proporción de operaciones realizadas por cada uno.
	
![Caso_2](/images/Caso_2.png)

Recordemos que cada proceso se vuelve a poner al final de la cola, sin importar que tanto uso le haya dado al quantum. Los procesos con E/S tienden a ejecutarse durante un breve período de tiempo y luego se bloquean, lo que significa que es posible que tengan que esperar en la cola durante mucho tiempo.
En este caso podemos ver que al compartir la CPU entre un proceso cpubound y un iobound, el planificador Round Robin prioriza el uso del cpubound ya que consume todo el quantum disponible, mientras que el iobound solo realiza unas pocas operaciones y cede la CPU para que siga ejecutando otro proceso.
Lo interesante es que al hacer los quantum más cortos, hay más intercambio de cpu entre los dos procesos, por lo tanto, un aumento en el iobound. Cuando el quantum es 100 veces más corto es muy notable que cpubench realiza muy pocas operaciones ya que el context switch siempre consume un porcentaje del quantum, solo que antes era poco notorio con un quantum por defecto. Con quantum 1000 veces más corto decaen los dos por la misma hipótesis sobre el consumo de context switch.

#### MLFQ

Luego de comparar el planificador Round Robin con los distintos tipos de quantum notamos su preferencia hacia los procesos cpu bound. Si bien este era un planificador justo, deseamos uno más inteligente que favorezca los trabajos ligados a la E/S sobre los trabajos ligados a la CPU. 
En este nuevo planificador incorporamos la noción de prioridad a cada proceso, y este influirá en la decisión del scheduler. Los procesos que ceden la CPU antes de que acabe su Quantum mantendrán la prioridad, y así evitaremos el problema de los IO bound. 
Para poder comparar ambos planificadores, realizaremos un experimento con la intención de mostrar la cantidad de operaciones que realiza un cpubench al ejecutarse solo, con 1 iobench, y con 2 iobench en paralelo; y luego la cantidad de operaciones que realiza un iobench al ejecutarse solo, con 1 cpubench y con 2 cpubench en paralelo. 
Antes de empezar suponemos lo siguiente: esperamos que mejore la interactividad de los procesos iobench y por ende su cantidad de operaciones. Esto es porque al no consumir todo el quantum, dichos procesos se mantienen siempre en la cola de mayor prioridad, mientras que en los procesos cpubench no se ven afectados, solo van descendiendo por la colas de mayor a menor prioridad.
	
En los casos 0 y 1, MLFQ se comporta igual que round robin y era de esperarse ya que no hace falta el uso de prioridad cuando se tiene un solo proceso. 
Veamos los otros casos. En cada gráfico nos interesa principalmente comparar los grupos de barras, es decir comparar iobench con iobench, y cpubench con otro cpubench; para ello usaremos porcentaje.

| Caso 2: 1 iobench 1 cpubench | Round Robin | Mlfq |
|------------------------------|-------------|------|
| cpubench                     | 8409        | 8065 |
| iobench                      | 33          | 231  |

![Caso_2_mlfq](/images/Caso 2_ mlfq.png)


| Caso 5: 2 iobench 1 cpubench | Round Robin | Mlfq |
|------------------------------|-------------|------|
| cpubench                     | 8459        | 7973 |
| iobench 1                    | 33          | 337  |
| iobench 2                    | 0           | 0    |

![Caso_5_mlfq](/images/Caso 5_ mlfq.png)


| Caso 6: 1 iobench 2 cpubench | Round Robin | Mlfq |
|------------------------------|-------------|------|
| iobench                      | 16          | 33   |
| cpubench 1                   | 9868        | 8388 |
| cpubench 2                   | 9868        | 0    |

![Caso_6_mlfq](/images/Caso 6_ mlfq.png)

Este caso (Round Robin) produce la mitad de operaciones para el iobench. Si recordamos lo que sucede en el caso 2 (1 iobench y 1 cpubench), el iobench realiza 33 operaciones aproximadamente, ya que hace un uso pequeño de la CPU y la cede para el proceso cpubench que utiliza el resto del quantum que dejó el iobench. Una vez terminado el quantum, vuelve hacer lo mismo, y así sucesivamente. Sin embargo ahora al tener 1 iobench y 2 cpubench en paralelo, en el primer quantum sucede lo mismo, pero en el segundo solo es para el otro proceso cpubench, por lo que el iobench tiene que esperar casi el doble de tiempo para que se vuelva a ejecutar.

Finalmente los procesos cpubench no sufren grandes cambios o son ínfimos al pasar del planificador RR a MLFQ, solo un pequeño descenso en la cantidad de operaciones. En contrapartida los iobench tienen un gran aumento al tener que esperar menos para volver a ser ejecutados.  Por otro lado, notamos que si hay dos procesos iobench, solo se ejecuta uno y el otro permanece en sleep, por lo que sufre starvation. Lo mismo sucede con dos cpubench en un Mlfq, ya que uno de los procesos obtiene un promedio de 0 operaciones realizadas.

### Parte 3 y 4
Se implementó una mlfq con tres niveles de prioridad. Los procesos se inicializan con prioridad máxima, descienden en prioridad si se interrumpen por timer y mantienen o aumentan su prioridad en caso contrario.  Las interrupciones por dispositivo también causan que el proceso libere su cpu, pero no modifican su prioridad. El planificador actualizado busca el proceso con la prioridad más alta y ejecuta en round robin todos aquellos procesos con ese valor de prioridad. 

También se implementó que todos los procesos por debajo de la prioridad máxima aumenten su prioridad cada diez ticks, y se logró la implementación de quantums variables según la prioridad. No se llegó a realizar mediciones tras la implementación de estas features.
