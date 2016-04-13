var fs = require('fs');
var stream = require('stream');
var es = require('event-stream');
var t = new Timer();
var best_pair = [];
var best_score = 0;
var words = read_stream();


//Function to test the amount of time it takes to run the script
function Timer(){
  var begin;
  return {
    start: function(){
      begin = new Date();
    },
    stop: function(){
      var end = new Date();
      var time = end.getTime() - begin.getTime();
      console.log('Finished in: ' + time + ' ms');
    }
  }
}

//I'm using Node's streams to pipe/read large files of data and parse it into chunks
//This eliminate the need for the script to load the entire file at the same time
//Creating a bottleneck and consuming a lot of memory
//With this method I can stream the data through pipes and format/parse it the way
//I want it.
function read_stream () {
  var counter = 0;
  t.start();
  var array_words = [];
  var stream = fs.createReadStream('words_en.txt').setEncoding('utf8')
    .pipe(es.split())
    .pipe(es.map(function(data, cb){
      //Each data/chunck is a word
      //we send cb(callback) to tell the stream to keep running, otherwise
      //it will keep waiting for a response
      //each pipe is like a chaining method where you can do stuff over the chunks
      var hash_map = {};
      if(data.length !== 0){
        counter += 1;
        //creating hash/object with each letter of the word and setting the ascii equas as the key and boolean as value.
        for(var i = 0; i < data.length; i++){
          hash_map[data[i].charCodeAt()] = true;
        }
        array_words.push({id: counter, idx: data[0].charCodeAt(), word: data, hash: hash_map, length: data.length});
      }
      cb();
    }))
    .on('error', function(){
      console.log("Error");
    })
    .on('end', function(){
      console.log("Done reading file...");
    });
    return array_words;
};

//Function returns the score of the highest_pair, it takes arguments and return score
function score_word_pair(args){
  var w1 = Array.prototype.slice.call(args)[0];
  var w2 = Array.prototype.slice.call(args)[1];
  var score = Array.prototype.slice.call(args)[2];
  return score;
}


function get_hightest_scoring_pair(words){
  var map = {};
  var len = words.length
  var index = 97;
  var next = index + 1;
  var score = 0;
  var unique_words = [];
  var highest_pair = [];

  //This will loop through the file and look to each word by first letter (idx) - (asuming the file is already sorted alphabetically)
  //The second condition of the if/stament just makes sure the idx of that letter is not inside the next word
  //The goal is to have a unique word for each letter of the alphabet or for each idx present in the file.
  //After the first condition is met, we check to see if that word is higher than the one already store,
  //If so, it will replace it, and change the score.
  //If first condition is not met, that means we have change of idx and will set the score to zero.
  for(var i = 0; i < len; i++){
    if(words[i].idx === index && words[next].hash[index] !== true){
      if(words[i].length > score){
        map[words[i].idx] = words[i];
        score = words[i].length;
      }
    } else {
      if(words[i].length > score){
        map[words[i].idx] = words[i];
      }
      score = 0;
      index += 1;
      i === len - 1 ? next = i : next = i + 1;
    }
  }

  //Push all the unique words in array, for the reason that working with objects was getting kinda messy (fix later) and with only 26 elements in the array
  //is pretty easy and not time consuming to iterate over it.
  for(var key in map){
    unique_words.push(map[key].word);
  }

  //This 2D array will go through each element of array and find the elements that do not have common letters.
  //If at the end of the iteration, the score still zero, then set highest_pair to any two words in the array
  //A score of zero at the end of the loop means all the words in the array share at least one letter, so their score will be zero.
  for(var i = 0; i < unique_words.length; i++){
    var word = unique_words[i];
    i == unique_words.length - 1 ? next = i : next = i + 1;
    for(var idx = 0; idx < word.length; idx++){
      var subStr = word[idx];
      if(unique_words[next].indexOf(subStr) != -1){
        break;
      } else if(unique_words[next].indexOf(subStr) == -1){
        if(unique_words[next].length * word.length > score && subStr == word[word.length - 1]){
          score = unique_words[next].length * word.length;
          highest_pair[0] = word;
          highest_pair[1] = unique_words[next];
          highest_pair[2] = score;
        }
      }
    }
    if(i === unique_words.length - 1 && score === 0){
      highest_pair[0] = word;
      highest_pair[1] = unique_words[next - 1];
      highest_pair[2] = score;
    }
  }
  return highest_pair;
}

//Setting timeout to let the script run the function without trigger the console.log first
//Javascript is running Asynchronously, so that's my easy fix to that.
//The drawback is I'm always assuming the script will always have the result in lest than 1000 ms, but the wait time can always be increase
//Promises can be use to work on this better.
setTimeout(function(){
  best_pair = get_hightest_scoring_pair(words);
  best_score = score_word_pair(best_pair);
  console.log("Highest scoring pair of words is:", best_pair.splice(0, 2).join(", "), "and with a score of", best_score);
  t.stop();
}, 1000);
