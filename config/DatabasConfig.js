const mongoose=require('mongoose');

const dbConnection=()=>{mongoose.connect(process.env.DB_URL_NODE)
.then((conn)=>{console.log(`database connected:${conn.connection.host}`)})
//.catch((err)=>{console.log(`database error:${err}`)});
}
module.exports=dbConnection;