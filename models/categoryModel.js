const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true , 'Category is Required'],
        unique:[true , 'Category must br unique'],
        minlength:[3 , 'Too Short Category name'],
        maxlength:[32 , 'Too long Category name ']
    },
    // A and B ==> shoping.com/a-and-b
    slug:{
        type:String,
        lowercase:true,
    },
    image:String

}, 
 {timestamps:true }
);


const setImageURL = (doc)=>{
    // return image Base url + image name 
    if(doc.image){
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl; 
    }
}


//   return image Base url + image name 

// Run before saved {findAll , findOne , Update}
CategorySchema.post('init' , (doc) =>{
    setImageURL(doc)
})

// Run After saved {Create }
CategorySchema.post('save' , (doc) =>{
    setImageURL(doc)
})




const CategoryModel = mongoose.model('Category' , CategorySchema);
module.exports = CategoryModel;