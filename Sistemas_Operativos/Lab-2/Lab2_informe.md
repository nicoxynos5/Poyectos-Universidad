# Informe Lab 2
## Grupo Milanesa
### Integrantes : 
* Juan Cruz Oviedo
* Lucía Daniela Lotumolo Sueldo
* Nicolás Xynos
* David Litvinoff

### INTRODUCCIÓN:

El objetivo del Laboratorio 2 fue implementar semáforos mediante las funciones “sem_open”, “sem_up”, “sem_down” y “sem_close”, haciendo uso de las llamadas acquire(), release(), sleep() y wakeup() para lograr control sobre el acceso de distintos procesos al recurso deseado. El producto resultante satisface robustamente los requerimientos dados y permite la ejecución sin problemas del programa de usuario “pingpong”, diseñado para verificar el correcto funcionamiento de los semáforos.
La idea fue usar dos semáforos, uno que le permita imprimir "ping" al hijo y uno imprimir "pong" al padre. Inicialmente el semáforo del padre no tiene recursos y el del hijo tiene uno sólo. Al usar dicho recurso imprime "ping" y aumenta el recurso del otro semáforo, haciendo que ahora el padre que estaba esperando por un recurso pueda utilizarlo gracias al uso preciso de acquire() y release(). En este caso el recurso representado puede entenderse como “el derecho de cada proceso a imprimir su string correspondiente”.


### IMPLEMENTACIÓN
Los semáforos se representan como un arreglo de enteros, cada cual tiene un lock asociado. Las funciones “sem_open”, “sem_up”, “sem_down” y “sem_close” adquieren al comienzo de su ejecución el lock correspondiente al semáforo que reciben como argumento mediante acquire() y lo liberan al final de la ejecución mediante release()





### DESCRIPCION DE LAS FUNCIONES
#### Acquire:
Funciona como un semáforo binario, que es provisto por el sistema operativo, para ser usado cuando se quiere acceder a partes críticas del sistema, que no pueden tener condiciones de carrera.
Acquire toma como entrada un struct spinlock *, que es el encargado de bloquear el acceso a esa estructura.
Acquire espera a que se libere la estructura sin soltar el control del programa.


#### Release:
Es la contraparte de acquire, cuando se terminó de usar la parte crítica del sistema se debe liberar, para que otro programa lo pueda usar.
Release toma como entrada un struct spinlock * , que debe ser el mismo que se le pasó a acquire para que se pueda liberar.
Por cada acquiere a una determinada estructura, debería haber un release para esa estructura.

#### Sleep
pone a dormir el proceso que la llama en un canal de espera (número arbitrario) y libera la CPU para realizar otro trabajo. Sleep también toma como argumento el bloqueo que sleep puede liberar sólo después de que el proceso que llama esté dormido.

#### Wakeup
despierta a todos los procesos que duermen, si es que los hay, en el canal de espera que recibe como parámetro, es decir cambia el estado del proceso de “SLEEPING” a “RUNNABLE”.

#### Argint
Recupera el n-ésimo argumento (int) de una función en nivel de usuario para pasarsela a una función de nivel de kernel (syscall).
