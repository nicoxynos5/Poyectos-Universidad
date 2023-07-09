#Guía
Primero debe abrir una terminal sobre el directorio "Resolución"
Luego ejecutar el comando "make", con esto ya se compilaron todos los archivos necesarios.
Por ultimo ejecutar "./mybash" para acceder a la consola mybash del proyecto.

Ahora ya puede utilizarlo como una consola común y corriente probando los distintos comandos que conozca.
Aca le sugiero algunos:
* ls 
* ls < tests > out
* ls  -l
* ls | sort -r
* ls | sort -r  >  out
* ls | sort -r | grep c
* ls -l | grep command > hola.txt
* ls > txt.txt y despues wc < txt.txt | wc | wc

Antes de salir, asegurese de hacer "make clean" para borrar los archivos compilados.
