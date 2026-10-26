const AsyncHandler = require('../middlewares/asyncHandler')
const APiFeatures = require('../utils/APiFeatures')
const ApiError = require('../utils/ApiError')

exports.deleteOne = (Model) =>
    AsyncHandler(async (req , res , next)=> {
    const  id = req.params.id;
    const document = await Model.findByIdAndDelete(id)
        if(!document){
         return next(new ApiError(`documnet with ${id} Not found` , 404))
    }
    res.status(204).send();

});


exports.updateOne = (Model) => 
    AsyncHandler(async (req , res , next)=> {
    const document = await Model.findByIdAndUpdate(
        req.params.id , 
        req.body, 
        {new : true , runValidations:true})
        // new :true : return category after update (without new:true -> return category before update)
    if(!document){ 
        return next(new ApiError(`documnet with ${req.params.id} Not found` , 404))
    }
    res.status(200).json({msg:'documnet Updated Succesfully',
        data:{
            document
        }
    })
});

exports.createOne = (model) =>
    AsyncHandler(async (req, res) => {
        const newDoc = await model.create(req.body);

        res.status(201).json({
            data: newDoc
        });
});

exports.getOne = (model) =>
        AsyncHandler(async (req , res ,next)=> {
            const id = req.params.id;
            const document = await model.findById(id)
            if(!document){
                return next(new ApiError(`No Document for this id ${id}` , 404))
            }
        res.status(200).json({data:{document}})
});

exports.getAll = (model , modelName = '') =>
     AsyncHandler(async (req , res) => {
        let filter = {};
        if(req.filterObj){
            filter = req.filterObj;
        }
        // Build query
    const documentCount = await model.countDocuments();
    const apiFeatures = new APiFeatures(model.find(filter), req.query)
        .search(modelName)
        .Filter()
        .sort()
        .limitFields()
        .paginate(documentCount);
    
        // Execute query 
        const {mongooseQuery , pagenationResult } = apiFeatures;
        const documents = await mongooseQuery;
   res.status(200).json({ length:documents.length , pagenationResult , data:{ document: documents}}) 
});