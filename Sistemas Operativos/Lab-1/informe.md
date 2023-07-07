# Informe Lab 1
## Grupo Milanesa
### Integrantes : 
* Juan Cruz Oviedo
* Lucía Daniela Lotumolo Sueldo
* Nicolás Xynos
* David Litvinoff

### Introducción 
En este laboratorio se implementó un intérprete de línea de comandos (shell). Se implementaron particularmente los módulos “command”, “parsing”, “execute” y “builtin”, asignando una división de tareas similar a una modalidad scrum y realizando reuniones semanales entre el equipo y con la profesora. A grandes rasgos, el módulo “command” define las funciones necesarias para la utilización de los TADs “command” y “pipeline”, los cuales son esenciales. El módulo “parsing” se encarga de la interpretación de los comandos escritos por el usuario en el shell para generar una instancia funcional del TAD necesario. El módulo “builtin” contempla los comandos internos del sistema, en este caso “cd”, “help” y “exit”, y el módulo “execute” se encarga de la ejecución del pipeline. Los módulos pudieron ser implementados de manera optimizada y robusta. El shell resultante soporta pipelines de n comandos, redirección de input y output y ejecución en foreground o background. 

###  Decisiones de implementación:
* Para los TADs “scommand” y “pipeline” del módulo “command” utilizamos la librería Glib para importar la implementación GSlist.
* Si el primer comando es interno, omite los siguientes y ejecuta dicho comando interno. En caso de detectar un comando interno que no sea el primero, no lo ejecuta e imprime un mensaje de error.
* El shell pierde memoria al ejecutarse la función “parser_last_garbage”, la cual devuelve una cadena que, según la especificación del TAD opaco, no debe ser liberada.

### Herramientas de desarrollo:
El desarrollo se realizó utilizando [el repositorio de BitBucket provisto por la cátedra](https://bitbucket.org/sistop-famaf/so22lab1g16/src/master/) para coordinación y actualización de código. El proyecto se compiló utilizando el makefile incluido en el kickstarter y sus tests para módulos específicos. Adicionalmente, se utilizaron las herramientas de debugging presentes en VSCode como por ejemplo la designación de breakpoints. El correcto manejo de la memoria se verificó utilizando la herramienta Valgrind.

#### Lista de commandos probados:
* ls 
* ls < tests > out
* ls  -l
* ls | sort -r
* ls | sort -r  >  out
* ls | sort -r | grep c
* ls -l | grep command > hola.txt
* ls > txt.txt y despues wc < txt.txt | wc | wc

### Proceso de desarrollo:
El desarrollo se llevó a cabo realizando en primer lugar una división de tareas por módulos para generar un esqueleto funcional del proyecto. Luego de esto, se mantuvo una comunicación constante vía Zulip, Whatsapp, Google Meet y las clases presenciales en FAMAF para tener una noción de los problemas particulares sobre los que trabajar en cada momento. Las dudas y problemas pudieron resolverse mediante comunicación entre el grupo y con la profesora. Ningún integrante tuvo problemas serios para acceder al repositorio y actualizarlo, y fue posible mantener una comunicación clara y detallada sobre la naturaleza de cada commit.
