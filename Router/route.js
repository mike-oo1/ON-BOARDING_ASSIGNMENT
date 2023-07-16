const {createRecord,getRecords,getRecord,updateRecord,deleteRecord} = require("../Controllers/controller")
const {userAuth} = require('../middlewares/authMiddleware')

const express = require('express')
const Router= express.Router()

Router.post("/records", userAuth, createRecord)
Router.get("/records", userAuth, getRecords)
Router.get("/records/:id", userAuth, getRecord)
Router.put("/records/:id", userAuth, updateRecord)
Router.delete("/records/:id", userAuth, deleteRecord)

const {registration,verifyEmail,resendEmailVerification,logIn,signOut} = require("../Controllers/user")
const {userAuth} = require('../middlewares/authMiddleware')


const express = require('express');
const Routers = express.Router();


Router.route("/signup").post(registration)
Router.route ("/verify/:id/:token").put( verifyEmail)
Router.route ("/re-verify").put(resendEmailVerification)
Router.route ("/login").post(logIn)
Router.route ("/logout/:id").put(signOut)

module.exports = Router


module.exports = Routers

