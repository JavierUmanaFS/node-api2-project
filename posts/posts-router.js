const router = require('express').Router();

const db = require('../data/db.js');



router.post('/', (req, res) => {
  const postInfo = req.body;
  if(!postInfo.title || !postInfo.contents){
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
  } else if(postInfo){
    db.insert(postInfo)
    .then(newPost => {
      res.status(201).json(newPost)})
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the post to the database." })
      console.log(err)})
  }
})

router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  const id = req.params.id;

  if (comment.text === "") {
    res.status(404).json({ errorMessage: "Please provide text for the comment" });
  }

  db.findById(id)
    .then(() => {
      db.insertComment(comment)
        .then((idObj) => {
          db.findCommentById(idObj.id)
          .then(comment => {
            res.status(201).json(comment);
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            errorMessage: "The post with the specified ID does not exist",
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

router.get('/', (req, res) => {
  db.find()
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json({
      message: 'Server Error'
    });
  })
});


router.get('/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
  .then(post => {
    if(post.length > 0){
      res.status(200).json(post);
    } else {
      res.status(500).json({ errorMessage: "The post information could not be retrieved."})
    }
  })
  .catch(err =>{
    res.status(404).json({ errorMessage: "The post with the specified ID does not exist"})
  })
})

router.get('/:id/comments', (req, res) => {
  const id = req.params.id;

  db.findPostComments(id)
  .then(post => {
    if(post.length > 0){
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist."})
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The comments information could not be retrieved."})
    console.log(err)})
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  db.remove(id)
  .then(res => {
    if(res){
      res.status(200).json({ message: "The post has been removed "})
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.'})
    }
  })
  .catch(err => {
    res.status(500).json({ error: 'The post could not be removed'})
    console.log(err)})
})

 router.put('/:id', (req, res) =>{
   const id = req.params.id;
   const newInfo = req.body;

   db.update(id, newInfo)
   .then(back=> {
    if(back > 0){
      db.findById(id)
      .then(post =>{
        res.status(200).json(post)
      })
      .catch(err => console.log(err,'findbyid err'))
    } else if(newInfo.title || newInfo.contents === '') {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    }})
   .catch(err => {
    res.status(500).json({ error: "The post information could not be modified."}) 
    })
 })

module.exports = router;