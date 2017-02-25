const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// we're going to add some items to BlogPosts
// so there's some data to look at

// 'The Fox Title', 'The quick brown fox jumped over the lazy dog', 'by Amy'
// BlogPosts.create({
//   title: 'The Fox Title',
//   content: 'The quick brown fox jumped over the lazy dog',
//   author: {
//     firstName: 'Amy',
//     lastName: 'Hagelin'
//   }
// }).then(document => {
//   console.log('blog post created', document)
// }).catch(err => {
//   console.error(err)
// })
// BlogPosts.create('Lorem Ipsum Title', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'by Ted');
// BlogPosts.create('Third Title', 'One two three four five six.', 'by Susana');

// when the root of this router is called with GET, return
// all current BlogPosts items
router.get('/posts', (req, res) => {
  BlogPosts.find().then(data => {
    res.json(data);  
  });  
});

// when a new item is posted, make sure it's
// got required fields ('name' and 'checked'). if not,
// log an error and return a 400 status code. if okay,
// add new item to BlogPosts and return it with a 201.
router.post('/posts', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  console.log(req.body)
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  // 'The Fox Title', 'The quick brown fox jumped over the lazy dog', 'by Amy'
// BlogPosts.create({
//   title: 'The Fox Title',
//   content: 'The quick brown fox jumped over the lazy dog',
//   author: {
//     firstName: 'Amy',
//     lastName: 'Hagelin'
//   }
// }).then(document => {
//   console.log('blog post created', document)
// }).catch(err => {
//   console.error(err)
// })
  const { title, content, author, publishDate } = req.body
  const { firstName, lastName } = author
  const blogPost = {
      title,
      content,
      author: {
        firstName,
        lastName
      },
      publishDate
    }
  BlogPosts
    .create(blogPost)
    .then(document => {
      res.status(201).json(document);
    })
  // const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  
});


// when DELETE request comes in with an id in path,
// try to delete that item from ShoppingList.
router.delete('/posts/:id', (req, res) => {
    // BlogPosts.delete(req.params.id); --> change this to mongoose style .then
  BlogPosts.findByIdAndRemove(req.params.id) // NEW
  .exec()
  .then(() => res.status(204).end())
  console.log(`Deleted blog post \`${req.params.ID}\``);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.update` with updated item.
router.put('/posts/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
   
   // apply to mongoose style
   const toUpdate = {};
   const updateableFields = {
      title,
      content,
      author: {
        firstName,
        lastName
      },
      publishDate
    };
    updatableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });

    BlogPosts
      .findByIdAndUpdate(req.params.id, {$set: toUpdate})
      .exec()
      .then(() => res.status(204).end())
});
//   const { title, content, author, publishDate } = req.body
//   const updatedItem = BlogPosts.update({
//     id: req.params.id,
//     title,
//     content,
//     author,
//     publishDate
//   });
//   console.log(req.params.id, updatedItem)
//   res.json(updatedItem);
// })

module.exports = router;