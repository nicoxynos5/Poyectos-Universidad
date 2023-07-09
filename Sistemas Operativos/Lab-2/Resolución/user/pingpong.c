#include "kernel/types.h"
#include "kernel/stat.h"
#include "user/user.h"

#define INIT_VAL -1

void 
checkerror(int sem)
{
  if (sem == -1)
    exit(1);
  
}

int
main(int argc, char *argv[])
{
  char * cerror = "close error\n";
  char * ferror = "fork error\n";
  char * ping = "ping\n";
  char * pong = "   pong\n";

  int n = atoi(argv[1]);

  if (n == 0){
    exit (0);
  }
  
  checkerror (sem_open (0,1));
  checkerror(sem_down(0));
  checkerror (sem_open (1,1));

  int id = fork();
  
  if (id < 0){
    printf ("%s", ferror);
    exit(1);
  }

  if (id == 0){
    for (unsigned int j = 0; j<n; j++){
      checkerror(sem_down(1));
      printf ("%s", ping);
      checkerror(sem_up(0));
    }
    exit (0);
  } 
  else {

    for (unsigned int i = 0; i<n; i++){
      checkerror(sem_down(0));
      printf ("%s",pong);
      checkerror(sem_up(1));
    }
    checkerror (sem_up(0));
    
    int close_check_0 = sem_close(0);
    int close_check_1 = sem_close(1);

    if (close_check_0 != INIT_VAL && close_check_1 != INIT_VAL){
      printf("%s",cerror);
      exit (1);
    }
  }
  
  exit(0);
}