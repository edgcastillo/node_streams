#Word Pair Problem
Some requirements:
1. Method should return a single pair of words
2. In the Event that multiple pairs tie for the hightest score
..* Any of these pairs is an acceptable answer
..* Pick one and only one, don't return a list of pairs
3. Zero, while the lowest possible score, is a valid score
4. Method signatures and return values should match Cognius' template

Cases:
[Spoke, Branch] = 30
  5  *   6      = 30

[Shrink, Branch] = 0 Because both words share one or two more letters.

Goal: for a file of 110k words, my script should run at 5 seconds or less.
Memory usage is not an issue but keep it down at gigabyte for the test is a good idea.

Steps:

-Array of words
-Iterate over each word and pair it with all the words in file/array.
-If the two words have "one" letter in common, set the result to 0
-Otherwise just multiple the length of each word and compare the result with the hightest one at that mmoment.
..* The first pair of words will automatically set the hightest value, after that we can keep comparing with the other words.
-After the algorithm is done checking all the words, return the two words with the hightest score and assign it to best_pair.
-Next step is to store the score of these two words and save it in another variable named best_score.
-After that it's just simple output
-Profit....
