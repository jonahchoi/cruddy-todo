const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {

    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if(err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    })
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  /* new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, files) => {
      let returnArr = files.map(file => {
        let retObj = {id: file, text: file};
        return retObj;
      });
      resolve(returnArr);
    });
  }).then((returnArr) => {callback(null, returnArr);})
    .catch((err) => callback(err)); */

  fs.readdir(exports.dataDir, (err, files) => {
    Promise.all(files.map(file => {
      return new Promise((res, rej) => {
        fs.readFile(`${exports.dataDir}/${file}`, (err, data) => {
          if(err) {
            rej(err);
          } else {
            let retObj = {id: `${file}`.split('.')[0], text: `${data}`};
            res(retObj);
          }
        });
      })

    }))
      .then((data) => {
        console.log(data);
        callback(null, data)})
      .catch((err) => callback(err));
  });
};

exports.readOne = (id, callback) => {
  /* var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  } */

  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if(err) {
      callback(err);
    } else {
      let retObj = {id: `${id}`.split('.')[0], text: `${data}`};
      callback(null, retObj);
    }
  });
};

exports.update = (id, text, callback) => {
 /*  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  } */
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, innerText) => {
    if(err) {
      callback(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if(err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  /* var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  } */
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
