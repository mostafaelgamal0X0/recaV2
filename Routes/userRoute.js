const { getUser, getAllUsers, deleteUser, updateUser, createUser, changeUserPassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData } = require("../services/userService");
const { protect , allowedTo} = require('../services/authService');




const express = require("express");
const { createuserValidator , getuserValidator , updateuserValidator , deleteuserValidator, changeUserPasswordValidator ,updateLoggeduserValidator } = require("../utiles/validators/userValidator");

const Router = express.Router()


Router.get('/getMe',protect ,getLoggedUserData ,getUser)
Router.put('/changeMyPassword',protect ,updateLoggedUserPassword )
Router.put('/updateMe',protect ,updateLoggeduserValidator ,updateLoggedUserData )
Router.delete('/deleteMe',protect, deleteLoggedUserData);

Router.put('/changePassword/:id',changeUserPasswordValidator,changeUserPassword)


Router.route('/').get(protect,allowedTo("admin","manger"),getAllUsers)
                 .post(protect,allowedTo("admin"),createuserValidator,createUser)


Router.route('/:id').get(protect,allowedTo("admin"),getuserValidator,getUser)
                    .delete(protect,allowedTo("admin"),deleteuserValidator,deleteUser)
                    .put(protect,allowedTo("admin"),updateuserValidator,updateUser)


module.exports = Router ;

