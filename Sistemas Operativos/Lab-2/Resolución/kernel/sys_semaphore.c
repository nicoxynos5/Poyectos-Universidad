#include "types.h"
#include "param.h"
#include "memlayout.h"
#include "riscv.h"
#include "spinlock.h"
#include "proc.h"
#include "defs.h"

#include "sys_semaphore.h"

#define INIT_VAL -1

struct spinlock semlock[NPROC];
static int SEMAPHORES[NPROC];
static int init_values[NPROC];

void 
semlockinit(void)
{
  struct spinlock *p;
  int i = 0;

  for (p = semlock; p < &semlock[NPROC]; p++){
    initlock(p, "semlock");
    SEMAPHORES [i] = INIT_VAL;
    init_values [i] = INIT_VAL;
    i ++;
  }
}

uint64
sem_open(int sem, int value)
{

  acquire(&semlock[sem]);
  if (SEMAPHORES[sem] != INIT_VAL)
  {
    printf("Sem error: initializing an already initialized semaphore\n", SEMAPHORES[sem]);
    release(&semlock[sem]);
    return INIT_VAL;
  }

  SEMAPHORES[sem] = value;
  init_values[sem] = value;
  
  release(&semlock[sem]);
  return SEMAPHORES[sem];
}

uint64
sem_up(int sem)
{
  acquire(&semlock[sem]);
  if (SEMAPHORES[sem] == INIT_VAL){
    printf("Sem error: uninitialized semaphore\n");
    release(&semlock[sem]);
    return INIT_VAL;
  }

  if (SEMAPHORES[sem] == 0){
    SEMAPHORES[sem]++;
    wakeup(&SEMAPHORES[sem]);
  }

  else if (SEMAPHORES[sem] < init_values[sem]){
    SEMAPHORES[sem]++;
  }

  else {
    printf("Sem error: exceeded semaphore capacity\n");
    release(&semlock[sem]);
    return -1;
  }

  release(&semlock[sem]);
  return SEMAPHORES[sem];
}

uint64
sem_down(int sem)
{
  acquire(&semlock[sem]);
  if (SEMAPHORES[sem] == INIT_VAL){
    printf("Sem error: uninitialized semaphore");
    release(&semlock[sem]);
    return INIT_VAL;
  }

  while(SEMAPHORES[sem]==0)
    sleep(&SEMAPHORES[sem], &semlock[sem]);


  SEMAPHORES[sem]--;
  
  release(&semlock[sem]);
  return SEMAPHORES[sem];
}

uint64
sem_close(int sem)
{
  acquire(&semlock[sem]);

  if (SEMAPHORES[sem] == INIT_VAL){
    printf("Sem error: Semaphore uninitialized, no close needed\n");
    release(&semlock[sem]);
    return SEMAPHORES[sem];
  }

  else if (SEMAPHORES[sem] != init_values [sem]){
    printf("Sem error: Semaphore being utilized, it can't be closed\n");
    release(&semlock[sem]);
    return SEMAPHORES[sem];
  }

  SEMAPHORES[sem] = INIT_VAL;
  release(&semlock[sem]);
  return SEMAPHORES[sem];
}