
const post = (model)=> async (req,res)=> {
    try{
        const item = await model.create(req.body);
        return res.status(201).send(item);

    }
    catch(er){
        return res.status(500).send(er.message);
    }
}

const get = (model)=> async(req,res)=>{
    try{
        const items = await model.find({"user_id":req.user._id}).lean().exec();

        return res.send(items);

    }
    catch(er){
        return res.status(500).send(er.message)
    }
}

