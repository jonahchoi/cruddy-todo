const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = () => {
  return new Promise((res, rej) => {
    fs.readFile(exports.counterFile, (err, fileData) => {
      if (err) {
        res(0);
      } else {
        res(Number(fileData));
      }
    });
  })
};

const writeCounter = (count) => {
  return new Promise((res, rej) => {
    var counterString = zeroPaddedNumber(count);
    fs.writeFile(exports.counterFile, counterString, (err) => {
      if (err) {
        rej('error writing counter');
      } else {
        res(counterString);
      }
    });
  })
};

// Public API - Fix this function //////////////////////////////////////////////
exports.getNextUniqueId = () => {
  /* readCounter((err, num) => {
    writeCounter(num + 1, (err, id)=>{
      if(err) {
        callback(err);
      }
      else {
        callback(null, id);
      }
    });
  }) */
  return readCounter()
    .then((counter) => {
      return writeCounter(counter + 1);
    })
    .then((count) => {
      return count;
    })
    .catch((err) => console.error(err));
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
exports.zeroPaddedNumber = zeroPaddedNumber;