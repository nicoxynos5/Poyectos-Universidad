#include <assert.h>
#include <glib.h>
#include <string.h> 

#include "command.h"
#include "strextra.h"

struct scommand_s {
    GSList * list;
    char * out;
    char * in;
};

struct pipeline_s {
    GSList * list_scommand;
    bool wait;
};

scommand scommand_new(void) {
    scommand self = malloc (sizeof (struct scommand_s));
    self->list = NULL;
    self->in = NULL;
    self->out = NULL;

    assert (scommand_is_empty (self) && scommand_get_redir_in (self) == NULL && scommand_get_redir_out (self) == NULL);
    return self;
}

scommand scommand_destroy(scommand self) {
    assert (self != NULL);
    free (self->in);
    self->in = NULL;
    free (self->out);
    self->out = NULL;
    g_slist_free_full (self->list, free);
    self->list = NULL;
    free(self);
    self = NULL;
    assert (self == NULL);
    return self;
}

static void scommand_destroy_1 (scommand self) {
    self = scommand_destroy (self);
}
void scommand_push_back(scommand self, char * argument) {
    assert (self != NULL && argument != NULL);
    self->list = g_slist_append (self->list, argument);
    assert (!scommand_is_empty(self));
}

void scommand_pop_front(scommand self) {
    assert (self!=NULL && !scommand_is_empty(self));
    GSList * aux = g_slist_remove_link(self->list, self->list);
    GSList * destroy = self->list;
    self->list = aux;
    g_slist_free_full (destroy, free);
    destroy = NULL;
    aux = NULL;
}

void scommand_set_redir_in(scommand self, char * filename) {
    assert (self != NULL);
    if (self->in != NULL) {
        free (self->in);
        self->in = NULL;
    }
    self->in = filename;
}

void scommand_set_redir_out(scommand self, char * filename) {
    assert (self != NULL);
    if (self->out != NULL) {
        free (self->out);
        self->out = NULL;
    }
    self->out = filename;
}

bool scommand_is_empty(const scommand self) {
    assert (self != NULL);
    //int len = g_slist_length(self->list);
    return (g_slist_length(self->list)== 0);
}

unsigned int scommand_length(const scommand self) {
    assert (self != NULL);
    unsigned int len = g_slist_length(self->list);
    return len;
}

char * scommand_front(const scommand self) {
    assert (self!=NULL && !scommand_is_empty(self));
    char * result = g_slist_nth_data(self->list, 0);
    assert (result != NULL);
    return result;
}

char * scommand_get_redir_in(const scommand self) {
    assert (self != NULL);
    char * result = self->in;
    return result;
}

char * scommand_get_redir_out(const scommand self) {
    assert (self != NULL);
    char * result = self->out;
    return result;
}

char * scommand_to_string(const scommand self) {
    assert (self!=NULL);
    unsigned int count = g_slist_length(self->list);
    char * result = NULL;

    result = strdup ("");
    if (count != 0) {
        char * aux, * med;
        for (unsigned int i = 0; i < count; i++) {
            aux = g_slist_nth_data(self->list, i);
            med = strmerge (result, aux);
            free (result); result = NULL;
            if (i != count - 1) {
                result = strmerge (med, " ");
                free (med); med = NULL;
            }
            else {
                result = strmerge (med, "");
                free (med); med = NULL;
            }
        }
        

        aux = self->out;
        if (aux != NULL) {
            med = strmerge (result, "> ");
            free (result); result = NULL;
            result = strmerge (med, aux);
            free (med); med = NULL;
            aux = strmerge (result, " ");
            free (result); result = NULL;
            result = strdup (aux);
            free (aux); aux = NULL;
        }
        
        aux = self->in;
        if (aux != NULL) {
            med = strmerge (result, "< ");
            free (result); result = NULL;
            result = strmerge (med, aux);
            free (med); med = NULL;
            aux = strmerge (result, " ");
            free (result); result = NULL;
            result = strdup (aux);
            free (aux); aux = NULL;
        }
    }
    assert (scommand_is_empty(self) || scommand_get_redir_in(self)==NULL || scommand_get_redir_out(self)==NULL || strlen(result)>0);
    return result;
}


pipeline pipeline_new(void) {
    pipeline self = malloc(sizeof(struct pipeline_s));
    self->wait = true;
    self->list_scommand = NULL;
    assert(self != NULL && pipeline_is_empty(self) && pipeline_get_wait(self));
    return self;
}

pipeline pipeline_destroy(pipeline self) {
    assert(self != NULL);
    g_slist_free_full (self->list_scommand,(GDestroyNotify) scommand_destroy_1);
    self->list_scommand= NULL;
    free(self);
    self = NULL;
    assert (self == NULL);
    return self;
}

void pipeline_push_back(pipeline self, scommand sc) {
    assert((self != NULL) && (sc != NULL));
    self->list_scommand = g_slist_append (self->list_scommand, sc);
    assert(!pipeline_is_empty(self));
}


void pipeline_pop_front(pipeline self) {
    assert(self!=NULL && !pipeline_is_empty(self));
    GSList * aux = g_slist_remove_link(self->list_scommand, self->list_scommand);
    GSList * destroy = self->list_scommand;
    self->list_scommand = aux;
    g_slist_free_full (destroy,(GDestroyNotify) scommand_destroy_1);
    destroy = NULL;
    aux = NULL;
}


void pipeline_set_wait(pipeline self, const bool w) {
    assert(self != NULL);
    self->wait = w;
}


bool pipeline_is_empty(const pipeline self) {
    assert (self != NULL);
    return (g_slist_length(self->list_scommand) == 0);
}

unsigned int pipeline_length(const pipeline self) {
    assert(self != NULL);
    unsigned int length = g_slist_length(self->list_scommand);
    assert ((length == 0) == pipeline_is_empty(self));
    return length;
}

scommand pipeline_front(const pipeline self) {
    assert(self!=NULL && !pipeline_is_empty(self));
    scommand result = g_slist_nth_data(self->list_scommand, 0);
    assert(result!=NULL);
    return result;
}

bool pipeline_get_wait(const pipeline self) {
    assert(self != NULL);
    return self->wait;
}

char * pipeline_to_string(const pipeline self) {
	assert(self!=NULL);
    unsigned int count = g_slist_length(self->list_scommand);
    char * result = NULL;
	
    result = strdup ("");

    if (count != 0) {
        char * aux, * med;
        for(unsigned int i = 0; i < count; i++) {
            aux = scommand_to_string(g_slist_nth_data(self->list_scommand , i));
            med = strmerge(result, aux);
            free (aux); aux = NULL;
            free (result); result = NULL;
            if (i != count - 1) {
                result = strmerge(med, " | ");
                free (med); med = NULL;
            }
            else {
                result = strmerge(med, "");
                free (med); med = NULL;
            }
        }
        if (self->wait == false) {
            aux = strmerge(result, " &");
            free (result); result = NULL;
            result = strdup (aux);
            free (aux); aux = NULL;
        }
    }
    assert (pipeline_is_empty(self) || pipeline_get_wait(self) || strlen(result)>0);
    return result;
}
