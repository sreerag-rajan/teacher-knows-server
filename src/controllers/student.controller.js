const express = require('express');

const Student = require('../models/student.model');
const Classes = require('../models/class.models');
const router = express.Router();

//Helper Functions
const getAllStudents = (classId, search={}) => {
  return new Promise((resolve, reject) => {
    Student.find({classId}).lean().exec()
      .then((students)=> resolve(students))
      .catch(er => reject(er))

  })
}

const updateClassHelper = (classId, increaseBy) => {
  return new Promise((resolve, reject) => {
    Classes.findByIdAndUpdate(classId, {$inc: {numberOfStudents: increaseBy}}, {new: true}).populate('subjects', ['name', '_id']).lean().exec()
      .then(res => resolve(res))
      .catch((er) => reject(er))
    
  })
}

//Routes
router.post('/', async (req, res) => {
  try{
    await Student.create(req.body)
    const students = await getAllStudents(req.body.classId);
    const classe = await updateClassHelper(req.body.classId, 1)
    return res.status(200).json({students, classe});

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
    let student = await Student.findById(req.params.id).lean().exec();
    let classe;
    if(student.classId !== req.body.classId){
      await Classes.findByIdAndUpdate(student.classId, {$inc : {numberOfStudents : -1}})
      classe = await updateClassHelper(req.body.classId, 1)
    }
    
    await Student.findByIdAndUpdate(req.params.id, req.body, {new:true}).lean().exec();
    
    const students = await getAllStudents(req.body.classId, search);
    return res.status(200).json({students, classe});

  }
  catch(er){
    console.error('ERROR ::: update student route ::: ', er);
    return res.status(500).json({error:er});
  }
})

router.delete('/:id', async (req, res) => {
  try{
    let info = await Student.findByIdAndDelete(req.params.id);
    const students = await getAllStudents(info.classId);
    const classe = await updateClassHelper(info.classId, -1);
    return res.status(200).json({students, classe});

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
      return res.status(400).json({msg: 'Student exists', student}); 
    else 
      return res.status(200).json({msg: "No Student Found"});
  }
  catch(er){
    console.error('ERROR ::: check classes Entity route :::', er);
    return res.status(500).json({error: er});
  }
})

router.post('/bulk-create', async (req, res) => {
  try{
    const {students, user, classId} = req.body;
    
    //Adding user to every student info
    const payload = students.map((el) => {
      return {...el, user};
    })

    //InsertMany
    await Student.insertMany(payload);

    //Preparing response to send back
    const response = await getAllStudents(classId);

    return res.status(200).json(response);
  }
  catch(er){
    console.error('ERROR ::: student bulk create ::: ', er);
    return res.status(500).json({error: er});
  }
})

module.exports = router