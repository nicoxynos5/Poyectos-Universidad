module Dibujos.Escher (
    escherConf,
    interpEsc
    --BasicaSinColor(..),
    --interpBasicaSinColor,
    --grilla
) where

import Graphics.Gloss (Picture, blue, color, line, polygon, pictures, red, 
                        white, Picture(Blank))

import qualified Graphics.Gloss.Data.Point.Arithmetic as V

import Dibujo (Dibujo, figura, juntar, apilar, rot45, rotar, encimar, espejar, 
                encimar4, cuarteto, r270, r180)
import FloatingPic (Output, half, zero)
import Interp (Conf(..), interp)

-- Supongamos que eligen.
data Escher = Trian | Vacio

interpEsc :: Output Escher
interpEsc Vacio _ _ _ = Blank
interpEsc Trian a b c = pictures [line $ triangulo a b c, cara a b c]
  where
      triangulo a b c = map (a V.+) [zero, c, b, zero]
      cara a b c = polygon $ triangulo (a V.+ half c) (half b) (half c)

-- El dibujoU.
dibujoU :: Dibujo Escher -> Dibujo Escher
dibujoU p = encimar4 p2
    where p2 = espejar(rot45 p)

-- El dibujo t.
dibujoT :: Dibujo Escher -> Dibujo Escher
dibujoT p = encimar p (encimar p2 p3)
    where p2 = espejar(rot45 p)
          p3 = r270 p2 

-- Esquina con nivel de detalle en base a la figura p.
esquina :: Int -> Dibujo Escher -> Dibujo Escher
esquina 0 _ = figura Vacio
esquina n p = cuarteto (esquina (n-1) p) (lado n p) 
                        (rotar (lado n p)) (dibujoU p)

-- Lado con nivel de detalle.
lado :: Int -> Dibujo Escher -> Dibujo Escher
lado 0 _ = figura Vacio
lado n p = cuarteto (lado (n-1) p) (lado (n-1) p) 
                    (rotar (dibujoT p)) (dibujoT p)

noneto :: Dibujo Escher -> Dibujo Escher -> Dibujo Escher -> Dibujo Escher -> Dibujo Escher
         -> Dibujo Escher -> Dibujo Escher -> Dibujo Escher -> Dibujo Escher -> Dibujo Escher 
noneto p q r s t u v w x =  apilar 2 1 
                            (juntar 2 1 p (juntar 1 1 q r))
                            (apilar 1 1 (juntar 2 1 s (juntar 1 1 t u)) 
                            (juntar 2 1 v (juntar 1 1 w x)))

-- El dibujo de Escher:
escher :: Int -> Escher -> Dibujo Escher
escher n e = noneto p q r s t u v w x
    where p = esquina n (figura e)
          q = lado n (figura e)
          r = r270 (esquina n (figura e))
          s = rotar (lado n (figura e))
          t = dibujoU (figura e)
          u = r270 (lado n (figura e))
          v = rotar (esquina n (figura e))
          w = r180 (lado n (figura e))
          x = r180 (esquina n (figura e))

escherConf :: Conf
escherConf = Conf {
    name = "Escher",
    pic = interp interpEsc (escher 9 Trian)
}
