module Test.TestDibujo where

import Test.HUnit
import Dibujo(Dibujo, foldDib, mapDib, figura, rot45, espejar, ciclar, encimar, juntar)


test1 :: Test
test1 = TestCase (assertEqual "mapDib" (figura 2) (mapDib (\x -> figura (x+1)) (figura 1)))

test2 :: Test
test2 = TestCase (assertEqual "mapDib" (ciclar (espejar (figura 2))) (mapDib (\x -> figura (x+1)) (ciclar (espejar (figura 1)))))

test3 :: Test
test3 = TestCase (assertEqual "mapDib" (encimar (figura 2) (rot45 (figura 3))) (mapDib (\x -> figura (x+1)) (encimar (figura 1) (rot45 (figura 2)))))

test4 :: Test
test4 = TestCase (assertEqual "folDib" 3 (foldDib x x x x z z w (encimar (figura 1) (figura 2))))
    where 
        x = (\y -> y)
        z = (\_ _ b1 b2 -> b1 + b2)
        w = (\b1 b2 -> b1 + b2)

test5 :: Test
test5 = TestCase (assertEqual "folDib" 3 (foldDib x x x x z z w (juntar 0.5 0.5 (figura 1) (figura 2))))
    where 
        x = (\y -> y)
        z = (\_ _ b1 b2 -> b1 + b2)
        w = (\b1 b2 -> b1 + b2)


tests = TestList [TestLabel "test1" test1, TestLabel "test2" test2, TestLabel "test3" test3, TestLabel "test4" test4, TestLabel "test5" test5]

main = do
    runTestTT tests
    return ()
    