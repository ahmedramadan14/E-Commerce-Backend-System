const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:[3 , 'To Short Product tilte '],
        maxlength:[100 , 'To long Product tilte '],
    },
    slug:{
        type:String,
        required:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:[true , 'Product descriptions is required'],
        minlength:[20 ,'To short product description'],

    },
    quantity:{
        type:Number,
        required:[true , 'product quantity is Required']
    },
    sold:{
        type:Number,
        default:0,
    },
    price:{
        type:Number,
        required:[true , 'product Price is Required'],
        trim:true,
        max:[200000 , 'To long product price']
    },
    priceAfterDiscount:{
        type:Number,
    },
    colors:[String],

    imageCover:{
        type:String,
        required:[true , 'product image Cover is Required ']
    },
    images:[String],
    
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:[true , 'product must be belong to category']
    },
    subcategories:[{
        type:mongoose.Schema.ObjectId,
        ref:'subcategories',
    }],
    brand:{
        type:mongoose.Schema.ObjectId,
        ref:'Brand'
    },
    ratingsAverage:{
        type:Number,
        min:[1 , 'Rating must be above or equal 1.0'],
        max:[5 , 'Rating must be below or equal 5.0'],
    },
    ratingsQuantity:{
        type:Number,
        default:0,
    },
} ,{ timestamps:true})


//productSchema.post('init')

// Mongoose Query middleware 
productSchema.pre(/^find/, function (next) {
    this.populate('category', 'name')
        .populate('subcategories' , 'name');
});


const setImageURL = (doc)=>{
    // imageCover
    if(doc.imageCover){
        doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    // images
    }if(doc.images &&  doc.images.length > 0){
        doc.images = doc.images.map(
            (img)=> `${process.env.BASE_URL}/products/${img}`
        );
    }
}

//   return image Base url + image name 

// Run before saved {findAll , findOne , Update}
productSchema.post('init' , (doc) =>{
    setImageURL(doc);
});


// Run After saved {Create }
productSchema.post('save' , (doc) =>{
    setImageURL(doc);
});

module.exports = mongoose.model('product' , productSchema)