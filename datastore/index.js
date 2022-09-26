const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = async (text, callback) => {
  var id = await counter.getNextUniqueId();
  // items[id] = text;
  console.log(`${exports.dataDir}/${id}`);
  fs.writeFile(`${exports.dataDir}/${id}`, text, (err) => {
    if(err) {
      throw('error creating/writing new todo')
    } else {
      callback(null, { id, text });
    }
  })
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  new Promise((resolve, reject) => {
    fs.readdir(exports.dataDir, (err, files) => {
      let returnArr = files.map(file => {
        let retObj = {id: file, text: file};
        return retObj;
      });
      resolve(returnArr);
    });
  }).then((returnArr) => {callback(null, returnArr);});

};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
