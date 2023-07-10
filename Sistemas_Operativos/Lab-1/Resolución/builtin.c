#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h> 
#include <unistd.h>
#include <fcntl.h>

#include "builtin.h"
#include "command.h"
#include "tests/syscall_mock.h"

bool builtin_is_internal(scommand cmd) {
    assert (cmd != NULL);
    bool is_internal = false;
    char * command = scommand_front(cmd);
    if (!strcmp(command, "cd")) {
        is_internal = true;
    }
    else if (!strcmp (command, "help")) {
        is_internal = true;
    }
    else if (!strcmp (command, "exit")) {
        is_internal = true;
    }
    return is_internal;
}

bool builtin_alone(pipeline p) {
    assert (p != NULL);
    
    bool is_internal = false;
    int length = pipeline_length(p);
    if (length == 1) {
        is_internal = builtin_is_internal (pipeline_front(p));
    }
    assert ((is_internal == (pipeline_length(p) == 1)) == builtin_is_internal(pipeline_front(p)));

    return is_internal;
}

static void cd (scommand cmd) {
    if (scommand_length (cmd) > 2) {
        printf ("Error: muchos argumentos\n");
    }
    else if (scommand_get_redir_out (cmd) != NULL || scommand_get_redir_in(cmd) != NULL /*cambiar*/) {
        printf ("Error: comando invalido (cd no es redireccionable)\n");
    }
    else {
        scommand_pop_front(cmd);
        char * path = scommand_to_string(cmd);
        int err = chdir(path);
        if (err != 0) {
            printf ("El path %s es invalido\n", path);
        }
        else {
            printf ("El cambio de directorio fue exitoso\n");
        }
        free (path);
        path = NULL;
    }
}

static void Help (scommand cmd) {
    if (scommand_length (cmd) != 1){
        printf ("muchos argumentos\n");
    }
    else if (scommand_get_redir_in(cmd) != NULL) {
        printf ("comando invalido\n");
    }
    else {
        char help [] = "\n" 
                "MyBash version 1.0\n"
                "Autores: David Litvinoff, Juan Cruz Oviedo, Lucía Daniela Lotumolo Sueldo, Nicolás Xynos\n"
                "Comandos internos:\n"
                "Nombre\n"
                "cd - Change working directory\n"
                "Synopsis\n"
                "cd *dirname*\n"
                "Descripcion\n"
                "Cambia el directorio de trabajo actual por *dirname*\n\n"
                "Nombre\n"
                "help - ayuda en criollo\n"
                "Synopsis\n"
                "help\n"
                "Descripcion\n"
                "Si estas leyendo esto es porque usaste help, felicitaciones!!\n"
                "Muestra el nombre del Shell, sus autores, los comandos internos implementados con una pequeña descripcion de cada uno\n\n"
                "Nombre\n"
                "exit - finalizar el programa\n"
                "Synopsis\n"
                "exit\n"
                "Descripcion\n"
                "Finaliza la shell Mybash, liberando toda la memoria pedida\n\n";

        if (scommand_get_redir_out (cmd) != NULL) {
            int Stdout = dup(1);
            int fd = open(scommand_get_redir_out (cmd), O_CREAT | O_RDWR | O_APPEND , S_IRUSR | S_IWUSR);
	        int err = dup2(fd,1);
            if (err == -1) {
                printf ("ocurrio un error al cambiar el file descriptor");
                return;
            }
            printf ("%s", help);
            close (fd);
            err = dup2(Stdout, 1);
            if (err == -1) {
                printf ("ocurrio un error al cambiar el file descriptor");
                return;
            }
        }
        else {
            printf ("%s", help);
        }
    }
}

static void Exit (scommand cmd) {
    //cambiar el stdin por algo que contenga EOF
    if (scommand_length (cmd) != 1) {
        printf ("muchos argumentos\n");
    }
    else if (scommand_get_redir_out (cmd) != NULL || scommand_get_redir_in(cmd) != NULL) {
        printf ("comando invalido (Exit no puede redireccionarse)\n");
    }
    else {
        close (0);
    }
}

void builtin_run(scommand cmd) {
    assert (builtin_is_internal(cmd));

    char * command = scommand_front(cmd);
    if (!strcmp(command, "cd")) {
        cd(cmd);
    }
    else if (!strcmp (command, "help")) {
        Help(cmd);
    }
    else {
        Exit(cmd);
    }
}
