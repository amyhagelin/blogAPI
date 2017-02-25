
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const blogPostRouter = require('./blogPostRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('Hello this is working');
 // res.sendFile(__dirname + '/views/index.html');
});

app.use('/blog-posts', blogPostRouter);

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });

// NEW PER WOJCIECH'S EMAIL
let server;

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blog-api';
const PORT = process.env.PORT || 8080;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


// let server;

// function runServer() {
//   const port = process.env.PORT || 8080;
//   return new Promise((resolve, reject) => {
//     server = app.listen(port, () => {
//       console.log(`Your app is listening on port ${port}`);
//       resolve(server);
//     }).on('error', err => {
//       reject(err)
//     });
//   });
// }

// // like `runServer`, this function also needs to return a promise.
// // `server.close` does not return a promise on its own, so we manually
// // create one.
// function closeServer() {
//   return new Promise((resolve, reject) => {
//     console.log('Closing server');
//     server.close(err => {
//       if (err) {
//         reject(err);
//         // so we don't also call `resolve()`
//         return;
//       }
//       resolve();
//     });
//   });
// }

// if (require.main === module) {
//   runServer().catch(err => console.error(err));
// };

// module.exports = {app, runServer, closeServer};