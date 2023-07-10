# Informe


## Integrantes:

    - Lucía Daniela Lotumolo Sueldo
    - Nicolás Xynos
    - Juan Ignacio Méndez



---
## Estructura del servidor
---

Una vez iniciado, el servidor realiza una escucha pasiva de requests mediante un socket. Al ser recibida y aceptada una request enviada por un cliente, se crea una conexión cliente-servidor. Esta conexión la maneja un subproceso separado, dejando al proceso principal libre para escuchar y aceptar nuevos clientes.La comunicación entre cliente y servidor se realiza mediante el protocolo HFTP, que implementa distintos comandos previamente especificados. 
Cuando el servidor establece la conexión con el cliente, está habilitado para recibir los comandos que posteriormente guardará en un buffer. Realiza lecturas de 4096 bytes ascii, y deja de recibir datos una vez que lee un EOL en el buffer. Luego divide los comandos cada vez que se encuentra con un terminador de línea, chequea que sea un comando con argumentos correctos y se deriva a la función correspondiente. Este proceso se repite hasta que no haya más EOL en el buffer, cuando se acaban vuelve a recibir comandos desde el socket.

---
## Decisiones de diseño tomadas
---
En el handle realizamos el chequeo de errores con el siguiente orden:
1. Que el comando sea uno de la list_commands que definimos en el archivo constans.py con los 4 comandos.
2. Que la cantidad de argumentos y sus tipos se corresponden con el comando solicitado.
3. Revisamos que el comando y sus argumentos solo tengan caracteres del set VALID_CHARS.
También decidimos contemplar ciertos errores que ocurrían al recibir datos del cliente, estos fueron el UnicodeDecodeError y el ConnectionResetError, de esta forma evitamos que se cayera el servidor.

---
## Dificultades
---

Principalmente nos costó pasar todos los test juntos, porque realizando el test de cada clase por separado pasaban perfectamente, pero se caía el servidor y eso no debería pasar.

---
## Preguntas
---
### ¿Qué estrategias existen para poder implementar este mismo servidor pero con capacidad de atender múltiples clientes simultáneamente?

Se puede realizar con forks, threads o async.

* Forks: Este método consiste en crear un proceso para cada cliente, lo que permite que un servidor maneje múltiples conexiones simultáneas ejecutándose en paralelo. Como cada uno tiene su propia memoria, no siempre veremos los cambios que puede haber generado otro proceso.


* Threads: todos los subprocesos comparten la memoria, por lo que si dos subprocesos quieren ingresar a una sección crítica surge una condición de carrera y se debe realizar un buen manejo de exclusión mutua.


* Async: resuelve el problema dividiendo la tarea y reprogramando partes de ella en algún momento posterior en el mismo hilo.




### ¿Qué diferencia hay si se corre el servidor desde la IP “localhost”, “127.0.0.1” o la ip “0.0.0.0”?


127.0.0.1  
Es el IP loopback, también referido como localhost, se utiliza para establecer una conexión IP a la misma máquina siendo usada por el usuario final.
Localhost se usa a menudo con fines de prueba y desarrollo. Su principal ventaja es que permite a los desarrolladores simular una conexión sin estar en línea.


0.0.0.0  
Significa que no hay una dirección normal asignada. Le dice a un servidor que "escuche" y acepte conexiones desde cualquier dirección IP.