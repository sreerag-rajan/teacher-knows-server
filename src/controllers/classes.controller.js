const express = require('express');

const Classes = require('../models/class.models');

const router = express.Router();

//Helper functions
const getAllClasses = async (user) => {
  return new Promise((resolve, reject)=>{
    await Classes.find({user}).sort({'grade': 1, 'section': 1}).lean().exec()
      .then((classes) => resolve(classes))
      .catch(er => reject(er));
  })
}

//Routes
router.post('/', async (req,res)=>{
  try{
    await Classes.create(req.body);
    const classes = await getAllClasses(req.body.user);
    return res.status(200).json(classes);
  }
  catch(er){
    console.error('ERROR ::: create classes route ::: ', er);
    return res.status(500).json({error: er});
  }
})

router.get('/', async (req,res)=>{
  try{
    const classes = await getAllClasses(req.body.user);
    return res.status(200).json(classes);
  }
  catch(er){
    console.error('ERROR ::: get all classes route ::: ', er);
    return res.status(500).json({error: er});
  }
})

router.get('/:id', async (req,res)=>{
  try{
    const classe = await Classes.findById(req.params.id).lean().exec()
    return res.status(200).json(classe)
  }
  catch(er){
    console.error('ERROR ::: get all classes route ::: ', er);
    return res.status(500).json({error: er});
  }
})

router.patch('/:id', async (req,res)=>{
  try{
    const classe = await Classes.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();
    return res.status(200).json(classe);
  }
  catch(er){
    console.error('ERROR ::: get all classes route ::: ', er);
    return res.status(500).json({error: er});
  }
})

router.delete('/:id', async (req,res)=>{
  try{
    await Classes.findByIdAndDelete(req.params.id);
    // const deletedStudents = await Students.deleteMany({classId : req.params.id})
    const classes = await getAllClasses(req.body.user);
    return res.status(200).json(classes);
    
  }
  catch(er){
    console.error('ERROR ::: get all classes route ::: ', er);
    return res.status(500).json({error: er});
  }
})


module.exports = router;

