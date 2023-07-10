module Interp (
    interp,
    Conf(..),
    interpConf,
    initial
) where

import Graphics.Gloss(Picture, Display(InWindow), makeColorI, color, pictures, 
                        translate, white, display)
import Dibujo (Dibujo, foldDib)
import FloatingPic (FloatingPic, Output, half, grid)

import qualified Graphics.Gloss.Data.Point.Arithmetic as V

-- Interpretación de un dibujo
-- formulas sacadas del enunciado
interp :: Output a -> Output (Dibujo a)
interp f = foldDib f rot esp rot45 api junt enci 
    where 
        rot = (\g x w h -> g (x V.+ w) h (V.negate w))
        esp = (\g x w h -> g (x V.+ w) (V.negate w) h)
        rot45 = (\g x w h -> g (x V.+ half (w V.+ h)) (half (w V.+ h)) ((half (h V.- w))))
        junt = (\n1 n2 g f x w h  -> pictures [g x ((n2 / (n2 + n1)) V.* w) h, 
                     f (x V.+ ((n2 / (n2 + n1)) V.* w)) ((n1 / (n2 + n1)) V.* w) h])
        api = (\n1 n2 g f x w h -> pictures [g (x V.+ ((n1 / (n2 + n1)) V.* h)) w ((n2 / (n2 + n1)) V.* h),
                    f x w ((n1 / (n2 + n1)) V.* h)]) 
        enci = (\g f x w h  -> pictures [g x w h, f x w h])
        
        
-- Configuración de la interpretación
data Conf = Conf {
        name :: String,
        pic :: FloatingPic
    }

interpConf :: Conf -> Float -> Float -> Picture 
interpConf (Conf _ p) x y = p (0, 0) (x,0) (0,y)

-- Dada una computación que construye una configuración, mostramos por
-- pantalla la figura de la misma de acuerdo a la interpretación para
-- las figuras básicas. Permitimos una computación para poder leer
-- archivos, tomar argumentos, etc.
initial :: Conf -> Float -> IO ()
initial cfg size = do
    let n = name cfg
        win = InWindow n (ceiling size, ceiling size) (0, 0)
    display win white $ withGrid (interpConf cfg size size) size size
  where withGrid p x y = translate (-size/2) (-size/2) $ 
                        pictures [p, color grey $ grid (ceiling $ size / 10) (0, 0) x 10]
        grey = makeColorI 120 120 120 120