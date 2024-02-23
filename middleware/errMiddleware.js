const ApiError = require("../utiles/ApiError");

const handelJwtInvalidSignature =()=> new ApiError("invalid token , please login again")

const handelJwtEpired = ()=> new ApiError("expired token , please login again")

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
      sendErrorForDev(err, res);
    } else {
      
      if(err.name === "JsonWebTokenError"){
       err =  handelJwtInvalidSignature()
      }


      if(err.name === "TokenExpiredError"){
        err =  handelJwtEpired()
       }

      sendErrorForProd(err, res);
    }
  };
  


  // TokenExpiredError
  const sendErrorForDev = (err, res) => {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };
  
  const sendErrorForProd = (err, res) => {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };
  


  module.exports = globalError;
