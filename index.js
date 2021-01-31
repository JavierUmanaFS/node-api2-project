const express = require('express');

const postsRouter = require('./posts/posts-router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) =>{
  res.send(`
  <h2>Post API</h2>
  <p>Welcome to the Posts Api</p>
  `);
});

server.use('/api/posts', postsRouter)

server.listen(4000, () => {
  console.log('SERVER RUNNING ......');
});