const fs = require('fs')
const path = require('path')
require('colors')
const dotenv = require('dotenv')

const Product = require('../../models/productModel')
const dbConnection = require('../../config/database')


dotenv.config({path: '../../config.env'})

dbConnection();


const Products = JSON.parse(fs.readFileSync(path.join(__dirname , 'product.json')));

const insertData = async() =>{
    try{
        await Product.create(Products);
        console.log('Data Inserted' .green.inverse);
        process.exit();
    } catch(err){
        console.log(err)
    }
}



const deleteData = async() =>{
    try{
        await Product.deleteMany();
        console.log('Data Destroyed' .red.inverse)
        process.exit();
    } catch(err){
        console.log(err)
    } 
}

if(process.argv[2] == '-i'){  // run using -> node seeder.js -i   | []  ? [0] = node , [1] = seeder.js , [2] = -i or -d
    insertData();
} else if(process.argv[2] == '-d'){
    deleteData();
}


