#include <stdlib.h>
#include <stdbool.h>

#include "parsing.h"
#include "parser.h"
#include "command.h"

static scommand parse_scommand(Parser p) {

    scommand cmd = scommand_new();
    arg_kind_t type = ARG_NORMAL;
    char * arg = NULL;
    bool at_pipe = false;
    bool garbage = true;
    
    arg = parser_next_argument(p, &type);

    if (arg == NULL) {
        parser_op_pipe(p, &at_pipe);
        if (!at_pipe) {
            parser_garbage(p, &garbage);
        }
        scommand_destroy (cmd);
        return NULL;
    }
    else if (type==ARG_NORMAL) {
        scommand_push_back(cmd,arg);
    }
    else {
        printf("Parse error: invalid command");
        /*cambie esta parte pq sino dejaba memory leak con cmd 
        y se intentaba liberar memoria estatica de at_pipe con free */
        scommand_destroy(cmd);
        return cmd;
    }

    while (!at_pipe) {
        
        parser_skip_blanks(p);
        arg = parser_next_argument(p, &type);

        if (arg == NULL) {
            break;
        }
        else if(type == ARG_NORMAL) {
            scommand_push_back(cmd,arg);
        }
        else if(type == ARG_INPUT) {
            scommand_set_redir_in(cmd, arg);
        }
        else if(type == ARG_OUTPUT) {
            scommand_set_redir_out(cmd,arg);
        }
        //
        //
        // no deberia entrar nunca a este else
        //
        //
        else {
            printf("Parse error: invalid command");
            scommand_destroy(cmd);
            return cmd;
        }
    }

    
    arg = NULL;
    return cmd;
}

pipeline parse_pipeline(Parser p) {
    pipeline result = pipeline_new();
    scommand cmd = NULL;
    bool error = false, another_pipe=true;
    bool wait = false;
    bool garbage = true;
    
    
    while (another_pipe) {

        cmd = parse_scommand(p);
        error = (cmd==NULL); /* Comando inválido al empezar */
        
        if (error) {
            //printf("Parser error: Null command\n");
            pipeline_destroy (result);
            return NULL;
        }
        else {
            pipeline_push_back(result, cmd);
            parser_skip_blanks(p);
        }
        parser_op_pipe(p, &another_pipe);

    }

    parser_skip_blanks(p);
    parser_op_background(p, &wait);
    pipeline_set_wait(result, !wait);
    parser_garbage(p, &garbage);
    if (garbage) {
        printf ("ocurrio un error de basura en parsing");
        pipeline_destroy (result);
        return NULL;
    }
    /* Tolerancia a espacios posteriores */
    /* Consumir todo lo que hay inclusive el \n */
    /* Si hubo error, hacemos cleanup */

    return result;
}

