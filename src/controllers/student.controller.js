const express = require('express');

const Student = require('../models/student.model');

const router = express.Router();

//Helper Functions
const getAllStudents = (classId, search={}) => {
  return new Promise((resolve, reject) => {
    Student.find({classId}).lean().exec()
      .then((students)=> resolve(students))
      .catch(er => reject(er))

  })
}

//Routes
router.post('/', async (req, res) => {
  try{
    await Student.create(req.body)
    const students = await getAllStudents(req.body.classId);
    return res.status(200).json(students);

  }
  catch(er){
    console.error('ERROR ::: create student route ::: ', er);
    return res.status(500).json({error:er});
  }
})

router.get('/', async (req, res) => {
  try{
    const {search} = req.params;
    const students = await getAllStudents(req.body.classId, search);
    return res.status(200).json(students);
  }
  catch(er){
    console.error('ERROR ::: get all students route ::: ', er);
    return res.status(500).json({error:er});
  }
})

router.get('/:id', async (req, res) => {
  try{
    const student = await Student.findById(req.params.id).lean().exec();
    return res.status(200).json(student);
  }
  catch(er){
    console.error('ERROR ::: get a student route ::: ', er);
    return res.status(500).json({error:er});
  }
})

router.patch('/:id', async (req, res) => {
  try{
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true}).lean().exec();
    return res.status(200).json(student);

  }
  catch(er){
    console.error('ERROR ::: update student route ::: ', er);
    return res.status(500).json({error:er});
  }
})

router.delete('/:id', async (req, res) => {
  try{
    let info = await Student.findByIdAndDelete(req.params.id);
    const students = getAllStudents(info.classId);
    return res.status(200).json(students);

  }
  catch(er){
    console.error('ERROR ::: delete students route ::: ', er);
    return res.status(500).json({error:er});
  }
})

router.post('/check-entity-availablity', async (req, res) => {
  try{
    const {rollNumber, classId, user } = req.body;
    const student = await Student.findOne({rollNumber, classId, user}).lean().exec();
    if(student)
      return res.status(400).json({msg: 'Student exists', classe}) 
    else 
      return res.status(200).json({msg: "No Student Found"});
  }
  catch(er){
    console.error('ERROR ::: check classes Entity route :::', er);
    return res.status(500).json({error: er});
  }
})

module.exports = router