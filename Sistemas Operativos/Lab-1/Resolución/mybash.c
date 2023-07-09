#include <pwd.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <unistd.h>


#include "command.h"
#include "execute.h"
#include "parser.h"
#include "parsing.h"
#include "builtin.h"
#include "strextra.h"


static void show_prompt(void) {
    char * first_half = NULL;
    char * result = NULL;
    char * dir = NULL;
    dir = getcwd(dir, 0);
    char * a = strtok (dir, "/");
    char * b;
    while (a != NULL) {
        b = a;
        a = strtok (NULL, "/");
    }
    first_half = strmerge (" ", b);
    free (dir);
    dir = NULL;
    struct passwd * pas  = getpwuid(getuid());
    result = strmerge (pas->pw_name, first_half);
    free (first_half);
    first_half = NULL;
    printf ("[%s] mybash> ", result);
    free (result);
    result = NULL;
    fflush (stdout);
}

int main(int argc, char *argv[]) {
    pipeline pipe;
    Parser parser;
    bool quit = false;
    int Stdin = 0;

    parser = parser_new(stdin);
    while (!quit) {
        if (Stdin != -1) {
            show_prompt(); 
            pipe = parse_pipeline(parser);
            
            if (pipe != NULL) {
                execute_pipeline(pipe);
                pipeline_destroy (pipe);
            }
        }
        else {
            break;
        }
        quit = parser_at_eof(parser);
        Stdin = dup (0);
    }

    parser_destroy(parser); parser = NULL;
    return EXIT_SUCCESS;

}

