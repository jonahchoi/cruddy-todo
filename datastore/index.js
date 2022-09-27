const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Bluebird = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  /* counter.getNextUniqueId((err, id) => {

    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if(err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    })
  }); */
  counter.getNextUniqueId()
    .then((id) => {
      let newTask = {
        text: text,
        createTime: new Date(),
        updateTime: null
      };
      fs.writeFile(`${exports.dataDir}/${id}.txt`, JSON.stringify(newTask), (err) => {
        if(err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      })
    })
    .catch((err) => console.error(err));
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
            let orgObj = JSON.parse(data);
            let retObj = {id: `${file}`.split('.')[0], text: `${orgObj.text}`};
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

exports.readOne = (id) => {
  /* var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  } */

  //Callback Version
  /* fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if(err) {
      callback(err);
    } else {
      let retObj = {id: `${id}`.split('.')[0], text: `${data}`};
      callback(null, retObj);
    }
  }); */

  //Promise Version
  return new Promise((res, rej) => {
    fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
      if(err) {
        rej(err);
      } else {
        let orgObj = JSON.parse(data);
        // console.log('org Obj.text', orgObj.text);
        let retObj = {id: `${id}`.split('.')[0], text: `${orgObj.text}`};
        res(retObj);
      }
    });
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
      let orgObj = JSON.parse(innerText);
      orgObj.text = text;
      orgObj.updateTime = new Date();
      fs.writeFile(`${exports.dataDir}/${id}.txt`, JSON.stringify(orgObj), (err) => {
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

exports.switch = (id, goingUp, callback) => {
  let fileToSwitch;

  if(goingUp === 'true') {
    fileToSwitch = counter.zeroPaddedNumber(Number(id) - 1);
  } else {
    fileToSwitch = counter.zeroPaddedNumber(Number(id) + 1);
  }
  let readFileAsync = Bluebird.promisify(fs.readFile);
  let writeFileAsync = Bluebird.promisify(fs.writeFile);
  Promise.all([readFileAsync(`${exports.dataDir}/${id}.txt`), readFileAsync(`${exports.dataDir}/${fileToSwitch}.txt`)])
    .then((data) => {
      let newText = `${data[1]}`;
      let orgText = `${data[0]}`;
      return Promise.all([writeFileAsync(`${exports.dataDir}/${id}.txt`, newText), writeFileAsync(`${exports.dataDir}/${fileToSwitch}.txt`, orgText)]);
    })
    .then(() => callback(null))
    .catch((err) => callback(err));
  //if goingUP, the file we pull from is id - 1
  //else id + 1
}

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
