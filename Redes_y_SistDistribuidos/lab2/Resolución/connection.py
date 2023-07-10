# encoding: utf-8
# Revisión 2019 (a Python 3 y base64): Pablo Ventura
# Copyright 2014 Carlos Bederián
# $Id: connection.py 455 2011-05-01 00:32:09Z carlos $

import socket
from constants import *
from base64 import b64encode
import os

class Connection(object):
    """
    Conexión punto a punto entre el servidor y un cliente.
    Se encarga de satisfacer los pedidos del cliente hasta
    que termina la conexión.
    """

    def __init__(self, socket, directory):
        # FALTA: Inicializar atributos de Connection
        self.s = socket
        self.direct = directory
        self.buffer = ''
        self.close = False
        pass

    def handle(self):
        """
        Atiende eventos de la conexión hasta que termina.
        """
        
        #while hasta q no haya mas comandos, o hasta q no se llama a quit
        #si un cliente deja de mandar comandos, pero no manda quit, que hacemos?
        while not self.close:
            try:
                data = self.s.recv(4096).decode("ascii")
                self.buffer += data
            except UnicodeDecodeError:
                self.send_code_messages(BAD_REQUEST)
                self.close = True
                self.s.close()
            except ConnectionResetError:
                self.close = True
                self.s.close()  
            while EOL in self.buffer and not self.close:    #ejecutamos lo q hay dentro del buffer hasta q no haya ams comandos
                client_command, self.buffer = self.buffer.split(EOL, 1)
                command_and_args = client_command.split(' ')
                command = command_and_args[0]
                if self.check_command(command):    #ahora chequeamos argumento
                    if self.check_args(command, command_and_args):
                        for i in command_and_args[1:]:
                            if not self.is_valid_chars(i):
                                self.send_code_messages(BAD_REQUEST)
                                self.close = True
                                self.s.close()
                        self.call_the_function(command_and_args)
        pass
            
    def send_code_messages(self, error_mes):
        message = " ".join([str(error_mes), error_messages[error_mes]+EOL])
        self.s.send(message.encode("ascii"))

    def is_valid_chars(self, args):
        invalid_chars = set(args) - VALID_CHARS
        return (len(invalid_chars) == 0)
            
    def call_the_function(self, command_and_args):
        command = command_and_args[0]
        if command == "get_file_listing":
            self.get_file_listing()
        elif command == "get_metadata":
            self.get_metadata(command_and_args[1])
        elif command == "get_slice":
            self.get_slice(command_and_args[1], int(command_and_args[2]), int(command_and_args[3]))
        else:
            self.quit()
    
    def check_args(self, command, command_and_args):  #chequeamos para saber si enviamos o no el error 201
        number_args = len(command_and_args) - 1
        if command == "get_file_listing" or command == "quit":
            if not number_args == 0:
                self.send_code_messages(INVALID_ARGUMENTS)
            else:
                return True
        elif command == "get_metadata":
            if not number_args == 1:
                self.send_code_messages(INVALID_ARGUMENTS)
            else:
                return True
        else:
            if not number_args == 3:
                self.send_code_messages(INVALID_ARGUMENTS)
            elif not (command_and_args[2].isnumeric() and command_and_args[3].isnumeric()):
                self.send_code_messages(INVALID_ARGUMENTS)
            else:
                return True
        
    def check_command(self, command): #chequeamos errores 100 y 200
        if '\n' in command: #100
            self.send_code_messages(BAD_EOL)
            self.s.close()  
            self.close = True
            return False
        elif command in list_commands:
            return True
        else:   #200
            self.send_code_messages(INVALID_COMMAND)
            return False
            
    def get_file_listing(self):
        dir_list = os.listdir(self.direct)
        files_with_EOL = [file + '\r\n' for file in dir_list]
        files_with_EOL.append('\r\n')
        self.send_code_messages(CODE_OK)
        for file in files_with_EOL:
            self.s.send(file.encode("ascii"))
        pass
        
    def get_metadata(self, filename):
        path = os.path.join(self.direct, filename)
        try:
            size = os.path.getsize(path) #si path no existe genera un OSError
            message = " ".join([str(CODE_OK), error_messages[CODE_OK] + EOL + str(size) + EOL])
            self.s.send(message.encode("ascii"))
        except OSError:
            self.send_code_messages(FILE_NOT_FOUND)
        
    def get_slice(self, filename, offset, size):
        """
        Responde con el fragmento del archivo filename
        desde el byte de inicio offset hasta size 
        codificado en base64
        """
        dir_list = os.listdir(self.direct)
        if filename in dir_list:
            file_length = os.path.getsize(os.path.join(self.direct, filename))
            if offset+size <= file_length:
                self.send_code_messages(CODE_OK)
                f = open(os.path.join(self.direct, filename), 'rb')
                f.seek(offset) 
                readed_bytes = f.read(size)
                encoded_text = b64encode(readed_bytes)
                f.close()
                self.s.send(encoded_text)
                self.s.send(EOL.encode("ascii"))
            else:
                self.send_code_messages(BAD_OFFSET)
        else:
            self.send_code_messages(FILE_NOT_FOUND)
                
    def quit(self):
        self.send_code_messages(CODE_OK)
        self.s.close()  
        self.close = True
            