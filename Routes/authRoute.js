const express = require("express");
const { signupValidator, loginValidator } = require("../utiles/validators/authValidator");
const { signup, login, forgotPassword, verifyPassResetCode, resetPassword } = require("../services/authService");
const Router = express.Router()






Router.route('/signup').post(signupValidator,signup)

Router.route('/login').post(loginValidator,login)

Router.route('/forgotPassword').post(forgotPassword)
Router.route('/verifyResetCode').post(verifyPassResetCode)
Router.route('/resetPassword').put(resetPassword)


// Router.route('/:id').get(getuserValidator,getUser).delete(deleteuserValidator,deleteUser).put(updateuserValidator,updateUser)

// Router.put('/changePassword/:id',changeUserPasswordValidator,changeUserPassword)

module.exports = Router ;