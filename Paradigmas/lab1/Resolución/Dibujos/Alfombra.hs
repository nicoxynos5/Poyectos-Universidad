module Dibujos.Alfombra (
    interpBas,
    alfombraConf
) where
    
import Graphics.Gloss (white, line, polygon, pictures, Picture(Blank))

import qualified Graphics.Gloss.Data.Point.Arithmetic as V

import Dibujo (Dibujo, figura, juntar, apilar, rot45, rotar, encimar, espejar, 
                encimar4, cuarteto, r270, r180)
import FloatingPic (Output, half, zero, raiz)
import Interp (Conf(..), interp)


data Alf = Cuad1 | Vacio

interpBas :: Output Alf
interpBas Vacio _ _ _ = Blank
interpBas Cuad1 a b c = polygon $ cuadrado a b c
    where 
        cuadrado a b c = map (a V.+) [zero, c, b V.+ c, b, zero]


-- El dibujoU.
dibujoU :: Alf -> Dibujo Alf
dibujoU c = noneto p q r s t u v w x
    where p = figura Vacio
          q = figura Vacio
          r = figura Vacio
          s = figura Vacio
          t = figura c
          u = figura Vacio
          v = figura Vacio
          w = figura Vacio
          x = figura Vacio

-- Función recursiva para el triángulo de Sierpinski
alfombra :: Int -> Dibujo Alf
alfombra 0 = dibujoU Cuad1
alfombra n = noneto p q r s t u v w x
    where p = alfombra (n-1)
          q = alfombra (n-1)
          r = alfombra (n-1)
          s = alfombra (n-1)
          t = figura Cuad1
          u = alfombra (n-1)
          v = alfombra (n-1)
          w = alfombra (n-1)
          x = alfombra (n-1)

noneto :: Dibujo Alf -> Dibujo Alf -> Dibujo Alf -> Dibujo Alf -> Dibujo Alf 
        -> Dibujo Alf -> Dibujo Alf -> Dibujo Alf -> Dibujo Alf -> Dibujo Alf 
noneto p q r s t u v w x =  apilar 2 1 
                            (juntar 2 1 p (juntar 1 1 q r))
                            (apilar 1 1 (juntar 2 1 s (juntar 1 1 t u)) 
                            (juntar 2 1 v (juntar 1 1 w x)))

alfombraConf :: Conf
alfombraConf = Conf {
    name = "Alfombra",
    pic = interp interpBas (alfombra 4)
}
