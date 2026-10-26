const ApiError = require("../utils/ApiError");

const devErrors = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

const prodErrors = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.isOperational ? err.message : 'Something went wrong'
    });
};

const   handleJwtInvalidSignature = () => new ApiError('Invalid token , please login again...' , 401);
const   handleJwtExpired = () => new ApiError('Expired token , please login again...' , 401);

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        if(err.name == 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if(err.name == 'TokenExpiredError') err = handleJwtExpired();
        prodErrors(err, res);
    } else {
        devErrors(err, res);
    }
};


module.exports = globalError;