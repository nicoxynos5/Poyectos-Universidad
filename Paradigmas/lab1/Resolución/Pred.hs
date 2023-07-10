module Pred (
  Pred,
  cambiar, anyDib, allDib, orP, andP
) where

type Pred a = a -> Bool

-- Dado un predicado sobre básicas, cambiar todas las que satisfacen
-- el predicado por la figura básica indicada por el segundo argumento.
cambiar :: Pred a -> a -> Dibujo a -> Dibujo a
cambiar p a d = mapDib (\x -> if (p x) then (figura a) else (figura x)) d

{-
LO QUE SE PIDE EN EL ENUNCIADO. ¿CUAL DEJAMOS AL FINAL?
-- Dado un predicado sobre figuras básicas, cambiar todas las que satisfacen
-- el predicado por el resultado de llamar a la función indicada por el
-- segundo argumento con dicha figura.

cambiar :: Pred a -> (a -> Dibujo a) -> Dibujo a -> Dibujo a
cambiar p a d = mapDib(\x -> if (p x) then (a x) else (Figura x)) d

-}

-- Alguna básica satisface el predicado.
anyDib :: Pred a -> Dibujo a -> Bool
anyDib p d = foldDib p x x x z z w d
  where x = (\y -> False || y)
        z = (\f1 f2 b1 b2 -> False || b1 || b2)
        w = (\b1 b2 -> False || b1 || b2)

-- Todas las básicas satisfacen el predicado.
allDib :: Pred a -> Dibujo a -> Bool
allDib p d = foldDib p x x x z z w d
  where x = (\y -> True && y)
        z = (\f1 f2 b1 b2 -> True && b1 && b2)
        w = (\b1 b2 -> True && b1 && b2)

-- Los dos predicados se cumplen para el elemento recibido.
-- andP f g x = f x && g x
andP :: Pred a -> Pred a -> Pred a
andP p q = (\x-> (p x) && (q x))

-- Algún predicado se cumple para el elemento recibido.
orP :: Pred a -> Pred a -> Pred a
orP p q = (\x-> (p x) || (q x))


