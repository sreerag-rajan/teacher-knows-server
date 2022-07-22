const express = require('express');

const Subject = require('../models/subject.model');

const router = express.Router();

//Helper functions
const getAllSubjects = async (user, search='')=>{
  return new Promise((resolve, reject)=>{
    Subject.find({user_id: user}).sort({'createdAt': -1}).where({name: new RegExp(search, 'i')}).lean().exec()
      .then((subjects)=> resolve(subjects))
      .catch((er)=>reject(er))
  })
}

//Routes
router.post('/', async (req, res)=>{
  try{
    await Subject.create(req.body);
    const subjects = await getAllSubjects(req.body.user)
    return res.status(200).json(subjects)

  }
  catch(er){
    console.error('ERROR ::: create subject route ::: ',er)
    return res.status(500).json({error: er})
  }
})

router.get('/', async (req, res)=>{
  try{
    const {search} = req.query;
    const subjects = await getAllSubjects(req.body.user, search);
    return res.status(200).json(subjects);
  }
  catch(er){
    console.error('ERROR ::: get all subjects route ::: ',er)
    return res.status(500).json({error: er})
  }
})

router.get('/:id', async (req, res)=>{
  try{
    const subject = await Subject.findById(req.params.id).lean().exec();
    return res.status(200).json(subject);

  }
  catch(er){
    console.error('ERROR ::: get a subject route ::: ', er);
    return res.status(500).json({error:er});
  }
})
router.patch('/:id', async (req, res)=>{
  try{
    await Subject.findByIdAndUpdate(req.params.id, req.body, {new:true}).lean().exec();
    const subjects = await getAllSubjects(req.body.user)
    return res.status(200).json(subjects);

  }
  catch(er){
    console.error('ERROR ::: update a subject route ::: ', er);
    return res.status(500).json({error:er});
  }
})

router.delete('/:id', async (req, res)=>{
  try{
    await Subject.findByIdAndDelete(req.params.id);
    const subjects = await getAllSubjects(req.body.user);
    return res.status(200).json(subjects);
  }
  catch(er){
    console.error('ERROR ::: delete a subject route ::: ', er);
    return res.status(500).json({error:er});
  }
})
module.exports = router;