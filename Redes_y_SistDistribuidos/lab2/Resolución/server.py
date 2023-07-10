#!/usr/bin/env python
# encoding: utf-8
# Revisión 2019 (a Python 3 y base64): Pablo Ventura
# Revisión 2014 Carlos Bederián
# Revisión 2011 Nicolás Wolovick
# Copyright 2008-2010 Natalia Bidart y Daniel Moisset
# $Id: server.py 656 2013-03-18 23:49:11Z bc $

import optparse
import socket
import sys
import threading
from connection import *
from constants import *



class Server(object):
    """
    El servidor, que crea y atiende el socket en la dirección y puerto
    especificados donde se reciben nuevas conexiones de clientes.
    """

    def __init__(self, addr=DEFAULT_ADDR, port=DEFAULT_PORT,
                 directory=DEFAULT_DIR):
        print("Serving %s on %s:%s." % (directory, addr, port))
        # FALTA: Crear socket del servidor, configurarlo, asignarlo
        # a una dirección y puerto, etc.
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.bind((addr, port))
        self.s.listen(5)
        print("ESTOY ESCUCHANDO\n")
        self.dir = directory

    def serve(self):
        """
        Loop principal del servidor. Se acepta una conexión a la vez
        y se espera a que concluya antes de seguir.
        """
            
        while True:
            print("estoy esperando \n")
            #en conexion se guarda un nuevo socket para la conexión
            #es el socket que usará para comunicarse con el cliente. Es distinto del socket de escucha que usa el servidor para aceptar nuevas conexiones
            connexion, client_Address = self.s.accept() 
            print('Got connection from', client_Address)
            conex = Connection(connexion, self.dir)
            t = threading.Thread(target=conex.handle)
            t.start()
            pass

                                                        
def main():
    """Parsea los argumentos y lanza el server"""
    parser = optparse.OptionParser()
    parser.add_option(
        "-p", "--port",
        help="Número de puerto TCP donde escuchar", default=DEFAULT_PORT)
    parser.add_option(
        "-a", "--address",
        help="Dirección donde escuchar", default=DEFAULT_ADDR)
    parser.add_option(
        "-d", "--datadir",
        help="Directorio compartido", default=DEFAULT_DIR)
    options, args = parser.parse_args()
    if len(args) > 0:
        parser.print_help()
        sys.exit(1)
    try:
        port = int(options.port)
    except ValueError:
        sys.stderr.write(
            "Numero de puerto invalido: %s\n" % repr(options.port))
        parser.print_help()
        sys.exit(1)
    server = Server(options.address, port, options.datadir)
    server.serve()


if __name__ == '__main__':
    main()
