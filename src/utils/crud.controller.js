import { response } from "express";

export const create = async ({model, body}) => {
  try{
    const created = await model.create(body);
    return created;
  }
  catch(er){
    console.error('ERROR ::: create CRUD Controller', er);
    return res.status(500).json({msg: 'ERROR ::: create CRUD Controller', er});
  }
}

export const getAll = async ({model, condition, sort, limit=100, offset=0}) => {
  try{
    const response = await model.find({condition}).lean().exec();
    return response;

  }
  catch(er){
    console.error('ERROR ::: getAll CRUD Controller', er);
    return res.status(500).json({msg: 'ERROR ::: getAll CRUD Controller', er});
  }
}