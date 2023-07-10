module Dibujos.Sierpinski (
    interpBas,
    sierpinskiConf
) where
    
import Graphics.Gloss (white, line, polygon, pictures, Picture(Blank))

import qualified Graphics.Gloss.Data.Point.Arithmetic as V

import Dibujo (Dibujo, figura, juntar, apilar, rot45, rotar, encimar,
         espejar, encimar4, cuarteto, r270, r180)
import FloatingPic (Output, half, zero, raiz)
import Interp (Conf(..), interp)


data Sier = Trian1 | Trian2 | Vacio

interpBas :: Output Sier
interpBas Vacio _ _ _ = Blank
interpBas Trian1 a b c = line $ triangulo a b c
  where
      triangulo a b c = map (a V.+) [zero, c V.+ half b , b, zero]


-- El dibujoU.
dibujoU :: Sier -> Dibujo Sier
dibujoU p1 = apilar 1 1 (figura p1) (juntar 1 1 (figura p1) (figura p1))

-- Función recursiva para el triángulo de Sierpinski
sierpinski :: Int -> Dibujo Sier
sierpinski 0 = dibujoU Trian1
sierpinski n = apilar 1 1 (juntar 3 1 (figura Vacio) (juntar 1 2(sierpinski (n-1)) (figura Vacio)))
                          (juntar 1 1 (sierpinski (n-1)) (sierpinski (n-1)))

sierpinskiConf :: Conf
sierpinskiConf = Conf {
    name = "Sierpinski",
    pic = interp interpBas (sierpinski 10)
}
