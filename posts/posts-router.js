const router = require('express').Router();

const db = require('../data/db.js');

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
        .then((inComingID) => {
          db.findCommentById(inComingID.id).then((comment) => {
            console.log(inComingID, 'im incoming single')
            console.log(inComingID.id, 'im incoming child')
            console.log(comment, 'comment')
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

// router.post('/:id/comments', (req, res) => {
// const id = req.params.id;
// const commentSent = req.body;

// if(commentSent.text === ''){
//   res.status(404).json({
//     message: 'The post with the specified ID does not exist.'
//   })
// }

// db.findCommentById(id)
// .then(comment => {
//   if(comment){
//     db.insertComment(commentSent)
//     .then( => {
      
//     })
//     .catch(err => console.log(err))
//   }
// })
// .catch(err => console.log(err))
// })

module.exports = router;