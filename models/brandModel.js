const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true , 'Brand is Required'],
        unique:[true , 'Brand must br unique'],
        minlength:[3 , 'Too Short Brand name'],
        maxlength:[32 , 'Too long Brand name ']
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
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl; 
    }
}


//   return image Base url + image name 

// Run before saved {findAll , findOne , Update}
brandSchema.post('init' , (doc) =>{
    setImageURL(doc)
})

// Run After saved {Create }
brandSchema.post('save' , (doc) =>{
    setImageURL(doc)
})



module.exports = mongoose.model('Brand' , brandSchema);