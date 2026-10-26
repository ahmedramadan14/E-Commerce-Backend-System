const multer = require('multer')
const ApiError = require('../utils/ApiError')


const multerOptions = ()=>{
        // 1 -  DiskStorage engine  
/* const multerStorage = multer.diskStorage({
    destination: function( req , file , cb){
        cb(null , 'uploads/categories');
    },
    filename: function( req , file , cb){
        // category-${id}-Date.now().jpeg
        const ext = file.mimetype.split('/')[1];
        const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
        cb(null , filename);
    },
});
 */

// 2 - Memory Storage engine 

    const multerStorage = multer.memoryStorage();
    
    
    const multerfilter = function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ApiError('Only Images allowed', 400), false);
        }
    };
    
    
    const upload = multer({storage : multerStorage , fileFilter : multerfilter});

    return upload;
}

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName); 

exports.uploadMixOfImages = (arrayofFields)=> multerOptions().fields(arrayofFields)
