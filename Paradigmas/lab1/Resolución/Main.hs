module Main (main) where

import Data.Maybe (fromMaybe)
import System.Console.GetOpt (ArgDescr(..), ArgOrder(..), OptDescr(..), getOpt)
import System.Environment (getArgs)
import Text.Read (readMaybe)

import Interp (Conf(name), initial)
import Dibujos.Ejemplo (ejemploConf)
import Dibujos.Feo (feoConf)
import Dibujos.Grilla (grillaConf)
import Dibujos.Escher (escherConf)
import Dibujos.Sierpinski (sierpinskiConf)
import Dibujos.Alfombra (alfombraConf)

-- Lista de configuraciones de los dibujos
configs :: [Conf]
configs = [ejemploConf, feoConf, grillaConf, escherConf, sierpinskiConf, alfombraConf]

-- Dibuja el dibujo n
initial' :: [Conf] -> String -> IO ()
initial' [] n = do
    putStrLn $ "\nNo hay un dibujo llamado " ++ n ++ "\n"
initial' (c : cs) n = 
    if n == name c then
        initial c 400
    else
        initial' cs n

main :: IO ()
main = do
    args <- getArgs
    if head args == "--list"
        then do
            putStrLn "\nLos dibujos disponibles son:\n"
            mapM_ putStrLn $ map name configs
            putStrLn "\nQue dibujo desea ver?\n"
            line <- getLine
            initial' configs line
        else
        initial' configs $ head args

{-
Explicacion del main:
Una acción IO se ejecuta cuando le damos el nombre main y ejecutamos nuestro programa
getArgs :: IO [String], devuelve una lista de strings
 que son los argumentos que se le pasan al programa.
putStrLn toma una cadena y devuelve una acción IO que devuelve un tipo ()
mapM_ toma una función, una lista y devuelve una acción IO
getLine es una acción IO que contiene un resultado del tipo String
-}
