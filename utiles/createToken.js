const { configDotenv } = require("dotenv")
const jwt = require("jsonwebtoken")



const createToken = (payload)=>
    {return jwt.sign({userId:payload}
        ,process.env.jwtSecretKey,
        {expiresIn:process.env.jwtExpireTime})}



module.exports = createToken