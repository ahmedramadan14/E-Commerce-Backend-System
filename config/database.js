const mongoose = require('mongoose');


// const dbConnection = async ()=>{
//     const atlasURI = process.env.CONN_STR;          // Atlas (online DB)
//     const localURI = process.env.LOCAL_CONN_STR;   // Local DB (offline DB) 

//     try {
//         await mongoose.connect(atlasURI);
//         console.log('Connected to Mongoose Atlas (Online DB)');
//     }catch(err){
//         console.warn('Atlas Connection failed, switching to local DB...');
//         try{
//             await mongoose.connect(localURI);
//             console.log('Connected to Local MongoDB (offline / Fallback)');
//         }catch(err2){
//             console.error('Faild to Connect to both Atlas and Local DB :' , err2.message);
//             process.exit(1);
//         }
//     }
// } 

// module.exports = dbConnection;

const dbConnection = () => {
    mongoose
        .connect(process.env.LOCAL_CONN_STR)
        .then(() => console.log('Database Connected Successfully'));
};

module.exports = dbConnection;
