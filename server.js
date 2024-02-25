const express=require('express');
const morgan=require('morgan');
const ApiError=require('./utiles/ApiError');
const dotenv=require('dotenv');
dotenv.config({path:'config.env'});
const dbConnection=require('./config/DatabasConfig');
const globaleError = require('./middleware/errMiddleware');
const mountRoutes = require('./Routes/index')
const cors = require('cors')
const compression = require('compression')

//connection with db
dbConnection();

const app=express();
//Enable other domains to access your application
app.use(cors())
app.options('*', cors())

app.use(compression())


//middlewares
app.use(express.json());

if(process.env.NODE_ENV==='development')
{
app.use(morgan('dev'));
console.log(`running on ${process.env.NODE_ENV} mode ` )

}


// Mount Routes
mountRoutes(app)

 app.all('*',(req,res,next)=>{
    next(new ApiError(`cant find this rout:${req.originalUrl}`,400));
 })
app.use(globaleError)

const port=process.env.PORT;
const server=app.listen(port,()=>{
    console.log(`listenting on port :${port}` );
})

process.on('unhandledRejection',(err)=>{
    console.log(`unhandledRejection error is :${err.name}|${err.message}`);
    server.close(()=>{
        console.log('server shuting down...');
        process.exit(1);
    });
})
