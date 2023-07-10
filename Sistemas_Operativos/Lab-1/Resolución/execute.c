#include "builtin.h"
#include "execute.h"
#include "parsing.h"
#include "command.h"

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <fcntl.h>

#include "tests/syscall_mock.h"

#define READ_END 0	/* index pipe extremo escritura */
#define WRITE_END 1 /* index pipe extremo lectura */

typedef struct s_child * child_list;

struct s_child{
    int * pid;
    int * status;
};


/*
 * Chequea que la llamada al sistema se haya realizado
 * de forma existosa, en caso contrario termina el
 * programa e informa que ocurió un error.
 */
static void check_error(int return_syscall) {
	if (return_syscall == -1) {
		fprintf(stderr, "a syscall failed\n");
		exit(EXIT_FAILURE);
	}
}

/*
 * Se guarda en el arreglo 'myargs' el comando a ejecutar
 * junto con sus parametros si es que los hay
 */
static void complete_myargs(char **myargs, pipeline apipe, int length) {

	for (int i = 0; i < length; i++) {
		char *command = scommand_front(pipeline_front(apipe));
		myargs[i] = strdup(command);

		scommand_pop_front(pipeline_front(apipe));
	}
	myargs[length] = NULL;
}

static void delete_myargs (char ** myargs, int length) {
	for (int i = 0; i < length; i++) {
		free (myargs[i]);
		myargs[i] = NULL;
	}
	free (myargs);
	myargs = NULL;
}

/*
 * redirecciona la entrada y/o salida de un proceso
 * en el caso de que se especifique en el TAD 'pipeline'
 */
static void redirection_execute(pipeline apipe, bool is_n) {
	char *redir_in = scommand_get_redir_in(pipeline_front(apipe));
	char *redir_out = scommand_get_redir_out(pipeline_front(apipe));

	if (redir_in != NULL && redir_out != NULL && !is_n) {
		int fd_in = open((redir_in), O_CREAT | O_APPEND | O_RDONLY, S_IRUSR | S_IWUSR);
		int fd_out = open((redir_out), O_CREAT | O_APPEND | O_WRONLY, S_IRUSR | S_IWUSR);
		check_error(fd_in);
		check_error(fd_out);

		check_error(dup2(fd_in, 0));
		check_error(dup2(fd_out, 1));

		check_error(close(fd_in));
		check_error(close(fd_out));
	}
	else if (redir_in != NULL) {
		int fd_in = open(strdup(redir_in), O_CREAT | O_APPEND | O_RDONLY, S_IRUSR | S_IWUSR);
		check_error(fd_in);

		check_error(dup2(fd_in, 0));

		check_error(close(fd_in));
	}
	else if (redir_out != NULL) {
		int fd_out = open((redir_out), O_CREAT | O_APPEND | O_WRONLY, S_IRUSR | S_IWUSR);
		check_error(fd_out);

		check_error(dup2(fd_out, 1));

		check_error(close(fd_out));
	}
}

/*
 * Ejecuta execvp con "myargs"
 * En caso de error, borra la memoria de "myargs" y sale.
 */
static void exec_myargs (char ** myargs, int length) {
	execvp(myargs[0], myargs);
	fprintf(stderr, "invalid command\n");
	delete_myargs(myargs, length);
	exit(EXIT_FAILURE);
}

static void execute_pipeline_1(pipeline apipe) {

	int rc = fork();
	check_error(rc);
	int length = scommand_length(pipeline_front(apipe));
	char **myargs = calloc(length + 1, sizeof(char *));

	if (rc == 0) { // child

		complete_myargs(myargs, apipe, length);

		redirection_execute(apipe, false);

		exec_myargs(myargs, length);
	}
	else { // parent

		if (pipeline_get_wait(apipe)) {
			int status = 0;
			check_error(waitpid(rc, &status, 0));
		}

		delete_myargs(myargs, length);
		
	}
}

static void execute_pipeline_2(pipeline apipe) {

	if (builtin_is_internal(pipeline_front(apipe))) {
		builtin_run(pipeline_front(apipe));
	}
	else {
		int fd[2];
		check_error(pipe(fd));

		int rc = fork();
		check_error(rc);
		int status;
		int length = scommand_length(pipeline_front(apipe));
		char **myargs = calloc(length + 1, sizeof(char *));

		if (rc == 0) { // child
		
			check_error(close(fd[READ_END]));

			complete_myargs(myargs, apipe, length);

			check_error(dup2(fd[WRITE_END], STDOUT_FILENO));

			check_error(close(fd[WRITE_END]));

			redirection_execute(apipe, false);
			pipeline_pop_front(apipe);

			if (builtin_is_internal(pipeline_front(apipe))) {
				delete_myargs(myargs, length);
				exit(EXIT_FAILURE);
			}

			exec_myargs(myargs, length);
		}
		else { // parent

			check_error(close(fd[WRITE_END]));

			int rc2 = fork();
			check_error(rc2);
			int status2;
			if (rc2 == 0) { // child 2

				check_error(dup2(fd[READ_END], STDIN_FILENO));
				check_error(close(fd[READ_END]));

				pipeline_pop_front(apipe);

				if (builtin_is_internal(pipeline_front(apipe))) {
					free(myargs);
					fprintf(stderr, "invalid command\n");
					exit(EXIT_FAILURE);
				}
				length = scommand_length(pipeline_front(apipe));
				complete_myargs(myargs, apipe, length);


				redirection_execute(apipe, false);
				exec_myargs(myargs, length);
			}

			check_error(close(fd[READ_END]));
			if (pipeline_get_wait(apipe)) {
				check_error(waitpid(rc, &status, 0));
				check_error(waitpid(rc2, &status2, 0));
			}
			delete_myargs(myargs, length);
		}
	}
}


static int run_command(pipeline apipe, int in, int out, int fd_0, int fd_1) {	
	pid_t pid = fork();
	check_error(pid);
	if (pid == 0) {
		int length = scommand_length (pipeline_front (apipe));
		char **myargs = calloc(length + 1, sizeof(char *));
		complete_myargs(myargs, apipe, length);
		
		if (in != 0 && out != 1) {
			check_error(close(fd_0));
			check_error(close(0));
			check_error(dup2(in, 0));
			check_error(close(in));

			check_error(close(fd_1));
			check_error(close(1));
			check_error(dup2(out, 1));
			check_error(close(out));
		}
		else {
			if (in != 0) {
				check_error(close(fd_1));
				check_error(close(0));
				
				check_error(dup2(in, 0));
				check_error(close(in));

			}
			else {
				redirection_execute(apipe, true);
			}
			if (out != 1) {
				check_error(close(1));
				check_error(close(fd_0));
				
				check_error(dup2(out, 1));
				check_error(close(out));
			}
			else {
				redirection_execute(apipe, true);
			}
		}

		exec_myargs(myargs, length);
	}
	return pid;
}


static void execute_pipeline_n(pipeline apipe) {

	if (builtin_is_internal(pipeline_front(apipe)))	{
		builtin_run (pipeline_front (apipe));
		return;
	}
	child_list child = malloc(sizeof(struct s_child));
	int n_commands = pipeline_length(apipe);
	child->pid = calloc(n_commands, sizeof(int));
	child->status = calloc(n_commands, sizeof(int));
	int in = 0;
	int fd [2];
	int fd_old [2];
	for (int i = 0; i < n_commands; i++) {
		child->status [i] = i;
		if (i != n_commands - 1) {
			pipe (fd);
		}
		if (i == n_commands - 1) {
			child->pid [i] = run_command (apipe, in, 1, -1, fd [1]);
			
		}
		else if (i == 0) {
			child->pid [i] = run_command (apipe, in, fd [1], fd [0], -1);
			in = fd [0];
			pipeline_pop_front(apipe);
		}
		else {
			child->pid [i] = run_command (apipe, in, fd [1], fd [0], fd_old[1]);
			in = fd [0];
			pipeline_pop_front(apipe);
		}
		if (i != 0) {
			check_error(close(fd_old [0]));
			check_error(close(fd_old [1]));
		}
		fd_old [0] = fd [0];
		fd_old [1] = fd [1];
		
	}
	
	if (pipeline_get_wait (apipe)) {
		for (int i = 0; i < n_commands; i++) {
			check_error(waitpid(child->pid[i], &child->status[i], 0));
		}
	}
	free(child->pid);
	free(child->status);
	free (child);
}



void execute_pipeline(pipeline apipe) {
	const int length = pipeline_length(apipe);
	if (length == 0) {
		return;
	}
	else if (length == 1) {
		if (builtin_is_internal(pipeline_front(apipe))) {
			builtin_run(pipeline_front(apipe));
		}
		else {
			execute_pipeline_1(apipe);
		}
	}
	else if (length == 2 ) {
		execute_pipeline_2(apipe);
	}
	else {
		execute_pipeline_n (apipe);
	}
}
