module Test.TestPred where

import Test.HUnit
import Pred(Pred, cambiar, anyDib, allDib, andP, orP)
import Dibujo(Dibujo, figura, mapDib, foldDib)

test1 :: Test
test1 = TestCase (assertEqual "andP" True (andP (==1) (==1) 1))

test2 :: Test
test2 = TestCase (assertEqual "andP" False (andP (==1) (==1) 2))

test3 :: Test
test3 = TestCase (assertEqual "orP" True (orP (==1) (==1) 1))

test4 :: Test
test4 = TestCase (assertEqual "orP" False (orP (==1) (==1) 2))

test5 :: Test
test5 = TestCase (assertEqual "anyDib" True (anyDib (==1) (figura 1)))

test6 :: Test
test6 = TestCase (assertEqual "anyDib" False (anyDib (==1) (figura 2)))

test7 :: Test
test7 = TestCase (assertEqual "allDib" True (allDib (==1) (figura 1)))

test8 :: Test
test8 = TestCase (assertEqual "allDib" False (allDib (==1) (figura 2)))

test9 :: Test
test9 = TestCase (assertEqual "cambiar" (figura 2) (cambiar (==1) 2 (figura 1)))

tests = TestList [TestLabel "test1" test1, TestLabel "test2" test2, TestLabel "test3" test3, TestLabel "test4" test4, TestLabel "test5" test5, TestLabel "test6" test6, TestLabel "test7" test7, TestLabel "test8" test8, TestLabel "test9" test9]

main = do
    runTestTT tests
    return ()
    