const express = require('express');

const Classes = require('../models/class.models');
const Student = require('../models/student.model');

const router = express.Router();

//Helper functions
const getAllClasses = async (user) => {
  return new Promise((resolve, reject)=>{
    Classes.find({user}).populate('subjects', ['name', '_id']).sort({'grade': 1, 'section': 1}).lean().exec()
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
    let classe = await Classes.findById(req.params.id).populate('subjects', ['name', '_id']).lean().exec();
    const students = await Student.find({classId : req.params.id, user: req.body.user}).lean().exec();
    if(students.length!== classe.numberOfStudents){
      classe = await Classes.findByIdAndUpdate(req.params.id, {numberOfStudents : students.length}, {new:true}).populate('subjects', ['name', '_id']).lean().exec();
    }
    return res.status(200).json({classe, students})
  }
  catch(er){
    console.error('ERROR ::: get all classes route ::: ', er);
    return res.status(500).json({error: er});
  }
})

router.patch('/:id', async (req,res)=>{
  try{
    await Classes.findByIdAndUpdate(req.params.id, req.body, {new:true}).lean().exec();
    const classes = await getAllClasses(req.body.user);
    return res.status(200).json(classes);
  }
  catch(er){
    console.error('ERROR ::: get all classes route ::: ', er);
    return res.status(500).json({error: er});
  }
})

router.delete('/:id', async (req,res)=>{
  try{
    await Classes.findByIdAndDelete(req.params.id);
    const deletedStudents = await Student.deleteMany({classId : req.params.id})
    const classes = await getAllClasses(req.body.user);
    return res.status(200).json(classes);
    
  }
  catch(er){
    console.error('ERROR ::: get all classes route ::: ', er);
    return res.status(500).json({error: er});
  }
})
router.post('/check-entity-availablity', async (req, res) => {
  try{
    const {grade, section, user } = req.body;
    const classe = await Classes.findOne({grade, section, user}).lean().exec();
    if(classe)
      return res.status(400).json({msg: 'Class exists', classe}) 
    else 
      return res.status(200).json({msg: "No Classes Found"});
  }
  catch(er){
    console.error('ERROR ::: check classes Entity route :::', er);
    return res.status(500).json({error: er});
  }
})


module.exports = router;

