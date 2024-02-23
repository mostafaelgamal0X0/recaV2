
const categoryRoute = require('./CategoryRoutes');
const productRoute = require('./productRoutes');
const subcategoryRoute = require('./subcategoryRoutes');
const userRoute = require('./userRoute')
const authRoute = require('./authRoute')
const couponRoute = require('./couponRoute')
const cartRoute = require('./cartRoute')

 const mountRoutes = (app)=>{
     
    app.use('/api/v1/categories', categoryRoute);
    app.use('/api/v1/subcategories',subcategoryRoute);
    app.use('/api/v1/products', productRoute);
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/coupons', couponRoute);
    app.use('/api/v1/cart', cartRoute);

 }


 module.exports = mountRoutes