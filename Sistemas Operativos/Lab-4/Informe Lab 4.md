# Informe Lab 4
## Grupo Milanesa
### Integrantes :
* Juan Cruz Oviedo
* Lucía Daniela Lotumolo Sueldo
* Nicolás Xynos
* David Litvinoff

##### 1) Cuando se ejecuta el main con la opción -d, ¿qué se está mostrando en la pantalla?
##### 2) ¿Hay alguna manera de saber el nombre del archivo guardado en el cluster 157?
##### 3) ¿Dónde se guardan las entradas de directorio? ¿Cuántos archivos puede tener adentro un directorio en FAT32?
##### 4) Cuando se ejecuta el comando como ls -l, el sistema operativo, ¿llama a algún programa de usuario? ¿A alguna llamada al sistema? ¿Cómo se conecta esto con FUSE? ¿Qué funciones de su código se ejecutan finalmente?  
##### 5) ¿Por qué tienen que escribir las entradas de directorio manualmente pero no tienen que guardar la tabla FAT cada vez que la modifican?
##### 6) Para los sistemas de archivos FAT32, la tabla FAT, ¿siempre tiene el mismo tamaño? En caso de que sí, ¿qué tamaño tiene?

1) Se muestran las llamadas a las funciones de fat-fuse: las que proveen su interfaz y otras de usos varios.
Para un nivel todavía mayor de debugging, pueden correr el código con `-d` y
mostrará los mensajes provenientes de Fuse.

2) Para hallar el contenido de un cluster arbitrario debe recorrerse el árbol de directorios obteniendo el start_cluster de cada nodo y recorriendo la FAT desde dicho cluster hasta llegar a EOF chequeando si alguno de ellos es el deseado, y devolviendo el nombre del archivo de serlo.

3) Por defecto, a los directorios les corresponde un único cluster. Las entradas se guardan en el cluster asignado. Con entradas de 32 bytes y clusters de 512, cada directorio puede tener 16 entradas.

4) No se llaman programas de usuario, sí llamadas de sistema para leer, imprimir por pantalla, etc. Sabemos con certeza que se ejecuta la función fat_fuse_readdir, ya que fue la que se modificó en las partes 1 y 2.

5) No hace falta escribir en el disco la FAT porque es una abstracción que se guarda en memoria

6) No, el tamaño de la FAT depende de la cantidad de clusters en que se divida el disco. Para discos con mayor capacidad la FAT será más grande salvo que, por ejemplo, se modifique el tamaño de las entradas del arreglo o de los clusters.
