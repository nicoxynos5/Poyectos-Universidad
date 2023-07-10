module Dibujos.Grilla (
    interpBas,
    grillaConf
) where
    
import Graphics.Gloss (Picture, blue, color, line, pictures, red, white,
         Picture(Text), Picture(Scale), Picture(Translate))
import Dibujo (Dibujo, figura, juntar, apilar, rot45, rotar, encimar, espejar)
import FloatingPic (Output, half, zero)
import Interp (Conf(..), interp)

data Basica = Texto Int Int deriving (Show, Eq)

interpBas :: Output Basica
interpBas (Texto n_1 n_2) (x1, x2) (y1, y2) (w1, w2) =
         Translate (x1) (x2 + w2*0.4) $ 
         Scale (0.0020* y1) (0.0020 * w2) $ Text (grilla_vector n_1 n_2)

row :: [Dibujo a] -> Dibujo a
row [] = error "row: no puede ser vacio"
row [d] = d
row (d:ds) = juntar (fromIntegral $ length ds) 1 d (row ds)

column :: [Dibujo a] -> Dibujo a
column [] = error "column: no puede ser vacio"
column [d] = d
column (d:ds) = apilar (fromIntegral $ length ds) 1 d (column ds)

grilla :: [[Dibujo a]] -> Dibujo a
grilla = column . map row

agrega :: Dibujo Basica -> [Dibujo Basica] -> [Dibujo Basica]
agrega d xs = d : xs

grilla_vector :: Int -> Int -> String
grilla_vector x y = "(" ++ (show x) ++ ", " ++ (show y) ++ ")"

lista_dib :: [Dibujo Basica] -> Int -> Int -> Int -> [Dibujo Basica]
lista_dib xs 0 n_1 n_2 = xs
lista_dib xs n n_1 n_2 = lista_dib (agrega (figura (Texto n_1 n_2)) xs) 
                                    (n-1) n_1 (n_2 - 1)

vectorAll :: Dibujo Basica
vectorAll = grilla [
    (lista_dib [] 8 0 7),
    (lista_dib [] 8 1 7),
    (lista_dib [] 8 2 7),
    (lista_dib [] 8 3 7),
    (lista_dib [] 8 4 7),
    (lista_dib [] 8 5 7),
    (lista_dib [] 8 6 7),
    (lista_dib [] 8 7 7)
    ]

grillaConf :: Conf
grillaConf = Conf {
    name = "Grilla",
    pic = interp interpBas vectorAll
}