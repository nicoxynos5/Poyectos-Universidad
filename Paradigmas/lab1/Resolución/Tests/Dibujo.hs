{-# LANGUAGE LambdaCase #-}
module Dibujo (
    Dibujo,
    figura, rotar, espejar, rot45, apilar, juntar, encimar,
    r180, r270,
    (.-.), (///), (^^^),
    cuarteto, encimar4, ciclar,
    foldDib, mapDib,
    figuras
) where

    {-
    Especificamos el nombre de un módulo al principio del módulo. 
    Si hemos llamado al fichero Dibujo.hs debemos darle el nombre de Dibujo a 
    nuestro módulo. Luego, especificamos la funciones que se exportan, y luego 
    comenzamos a definir dichas funciones.
    -}


{-
Gramática de las figuras:
<Fig> ::= Figura <Bas> | Rotar <Fig> | Espejar <Fig> | Rot45 <Fig>
    | Apilar <Float> <Float> <Fig> <Fig> 
    | Juntar <Float> <Float> <Fig> <Fig> 
    | Encimar <Fig> <Fig>
-}

data Dibujo a = Figura a | Rotar (Dibujo a) | Espejar (Dibujo a) | Rot45 (Dibujo a)
            | Apilar Float Float (Dibujo a) (Dibujo a) 
            | Juntar Float Float (Dibujo a) (Dibujo a)
            | Encimar (Dibujo a) (Dibujo a)
    deriving (Eq, Show)

-- Agreguen los tipos y definan estas funciones

-- Construcción de dibujo. Abstraen los constructores.

figura :: a -> Dibujo a
figura a = Figura a 

rotar :: Dibujo a -> Dibujo a
rotar d = Rotar d

espejar :: Dibujo a -> Dibujo a
espejar d = Espejar d

rot45 :: Dibujo a -> Dibujo a
rot45 x = Rot45 x

apilar :: Float -> Float -> Dibujo a -> Dibujo a -> Dibujo a
apilar f1 f2 x y = Apilar f1 f2 x y 

juntar :: Float -> Float -> Dibujo a -> Dibujo a -> Dibujo a
juntar f1 f2 x y = Juntar f1 f2 x y 

encimar :: Dibujo a -> Dibujo a -> Dibujo a
encimar x y = Encimar x y

-- Rotaciones de múltiplos de 90.
r180 :: Dibujo a -> Dibujo a
r180 x = rotar(rotar x)

r270 :: Dibujo a -> Dibujo a
r270 x = r180(rotar(x))

-- Pone una figura sobre la otra, ambas ocupan el mismo espacio.
(.-.) :: Float -> Float -> Dibujo a -> Dibujo a -> Dibujo a
(.-.) f1 f2 x y = apilar f1 f2 x y

-- Pone una figura al lado de la otra, ambas ocupan el mismo espacio.
(///) :: Float -> Float -> Dibujo a -> Dibujo a -> Dibujo a
(///) f1 f2 x y = juntar f1 f2 x y

-- Superpone una figura con otra.
(^^^) :: Dibujo a -> Dibujo a -> Dibujo a
(^^^) x y = encimar x y

-- Dadas cuatro figuras las ubica en los cuatro cuadrantes.
cuarteto :: Dibujo a -> Dibujo a -> Dibujo a -> Dibujo a -> Dibujo a
cuarteto d1 d2 d3 d4 = Juntar 1.0 1.0 (Apilar 1.0 1.0 (d1) (d3)) (Apilar 1.0 1.0 (d2) (d4))

-- Una figura repetida con las cuatro rotaciones, superpuestas.
encimar4 :: Dibujo a -> Dibujo a 
encimar4 x = (^^^) ((^^^) x (rotar x)) ((^^^) (r180 x) (r270 x))

-- Cuadrado con la misma figura rotada i * 90, para i ∈ {0, ..., 3}.
-- No confundir con encimar4!
ciclar :: Dibujo a -> Dibujo a 
ciclar x = Apilar 1.0 1.0 (Juntar 1.0 1.0 x (rotar x)) (Juntar 1.0 1.0 (r180 x) (r270 x))

-- Estructura general para la semántica (a no asustarse). Ayuda: 
-- pensar en foldr y las definiciones de Floatro a la lógica
foldDib :: (a -> b) -> (b -> b) -> (b -> b) -> (b -> b) ->
       (Float -> Float -> b -> b -> b) -> 
       (Float -> Float -> b -> b -> b) -> 
       (b -> b -> b) ->
       Dibujo a -> b
foldDib f1 f2 f3 f4 f5 f6 f7 (Figura x) = f1 x
foldDib f1 f2 f3 f4 f5 f6 f7 x = case x of
    (Rotar d) -> f2 (foldDib f1 f2 f3 f4 f5 f6 f7 d)
    (Espejar d) -> f3 (foldDib f1 f2 f3 f4 f5 f6 f7 d)
    (Rot45 d) -> f4 (foldDib f1 f2 f3 f4 f5 f6 f7 d)
    (Juntar float1 float2 d1 d2) -> f6 float1 float2 (foldDib f1 f2 f3 f4 f5 f6 f7 d1) (foldDib f1 f2 f3 f4 f5 f6 f7 d2)
    (Apilar float1 float2 d1 d2) -> f5 float1 float2 (foldDib f1 f2 f3 f4 f5 f6 f7 d1) (foldDib f1 f2 f3 f4 f5 f6 f7 d2)
    (Encimar d1 d2) -> f7 (foldDib f1 f2 f3 f4 f5 f6 f7 d1) (foldDib f1 f2 f3 f4 f5 f6 f7 d2)

-- Demostrar que `mapDib figura = id`
mapDib :: (a -> Dibujo b) -> Dibujo a -> Dibujo b
mapDib f x = case x of
    (Figura d) -> f d
    (Rotar d) -> rotar (mapDib f d)
    (Espejar d) -> espejar (mapDib f d)
    (Rot45 d) -> rot45 (mapDib f d)
    (Apilar x y d1 d2) -> apilar x y (mapDib f d1) (mapDib f d2)
    (Juntar x y d1 d2) -> juntar x y (mapDib f d1) (mapDib f d2)
    (Encimar d1 d2) -> encimar (mapDib f d1) (mapDib f d2)

-- Junta todas las figuras básicas de un dibujo.
figuras :: Dibujo a -> [a]
figuras (Figura b) = [b]
figuras (Rotar d) = figuras d
figuras (Espejar d) = figuras d 
figuras (Rot45 d) = figuras d 
figuras (Apilar f1 f2 d1 d2) = (figuras d1) ++ (figuras d2)
figuras (Juntar f1 f2 d1 d2) = (figuras d1) ++ (figuras d2)
figuras (Encimar d1 d2) = (figuras d1) ++ (figuras d2)