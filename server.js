const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');


dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/ApiError')
const globalError = require('./middlewares/errorMiddleware')
const dbConnection = require('./config/database')

// express app
const app = express();

app.set('query parser', 'extended');

// Routes
const categoryRoute = require('./routes/categoryRouts');
const subCategoryRoute = require('./routes/subCategoryRouts')
const brandRoute = require('./routes/brandRouts')
const productRoute = require('./routes/productRouts')
const userRoute = require('./routes/userRouts')
const authRoute = require('./routes/authRouts ')
const reviewRoute = require('./routes/reviewRouts')



// Connent With db
dbConnection();


// Middlewares 
app.use(express.json());
app.use(express.static(path.join(__dirname , 'uploads')));
app.use(express.urlencoded({ extended: true }));

const mode = process.env.NODE_ENV || 'development';
    console.log(`mode : ${mode}`);
if (mode === 'development') {
    app.use(morgan('dev'));
}

// Mount Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subCategories', subCategoryRoute);
app.use('/api/v1/brands' , brandRoute);
app.use('/api/v1/products' , productRoute)
app.use('/api/v1/users' , userRoute)
app.use('/api/v1/auth' , authRoute)
app.use('/api/v1/review' , reviewRoute)




app.use((req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}` , 404))
});


// Global error handling middleware
app.use(globalError)


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`App Running on PORT ${PORT}`);

});


process.on('unhandledRejection', err => { // to handle unhandled promise rejections
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down....');

  server.close(() => {  // first close the server
    process.exit(1);  // then exit the process
  });
})
