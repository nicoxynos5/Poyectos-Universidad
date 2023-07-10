#ifndef SEMAPHORE_H
#define SEMAPHORE_H

#include "types.h"

uint64 sem_open(int sem, int value);
uint64 sem_up (int sem);
uint64 sem_down (int sem);
uint64 sem_close (int sem);

#endif