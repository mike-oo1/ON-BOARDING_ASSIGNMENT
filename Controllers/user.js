require('dotenv').config();
const userModel = require("../Models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailSender = require("../Middlewares/email")


exports.registration = async (req, res)=>{
    try {
        const { username, email, password } = req.body;
        const isEmail = await userModel.findOne({email});
        if (isEmail) {
            res.status(400).json({
                message: `User with this Email: ${email} already exist.`
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash( password, salt )
            const token = await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '10m'});
            const data = {
                username,
                email,
                password: hashPassword,
                token: token
            };
            const user = new userModel(data);
            const savedUser = await user.save();
            const subject = 'Kindly Verify'
            const link = `${req.protocol}://${req.get('host')}/api/verify/${savedUser._id}/${token}`
            const message = `Welcome onBoard, kindly use this link ${link} to verify your account. Kindly note that this link will expire after 5(five) Minutes.`
            emailSender({
                email: savedUser.email,
                subject,
                message
            });
            if (!savedUser) {
                res.status(400).json({
                    message: "Failed to Create Account"
                })
            } else {
                res.status(201).json({
                    message: "Account Successfully created",
                    data: savedUser
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}; 


exports.verifyEmail = async (req, res)=>{
    try {
        const user = await userModel.findById(req.params.id);
        const {token} = req.params;
        const registeredToken = token;
        const verified = await userModel.findByIdAndUpdate(req.params.id, {isVerified: true})
        await jwt.verify(registeredToken, process.env.JWT_SECRET, (err)=>{
            if(err) {
                res.json(" Link  Expired")
            } else {   
                if (!verified) {
                    res.status(404).json({
                        message: "User is not verified yet"
                    })
                } else {
                    res.status(200).json({
                        message: `User with Email: ${verified.email} verified successfully`
                    })
                }
            }
        })  
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};




exports.resendEmailVerification = async(req, res)=>{
    try {
        const { email } = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
        }else {
            const verified = await userModel.findByIdAndUpdate(user._id, {isVerified: true})
            const token = await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '5m'});
            await jwt.verify(token, process.env.JWT_SECRET, (err)=>{
                if(err) {
                    res.json('This Link is Expired. Please try again')
                } else {   
                    if (!verified) {
                        res.status(404).json({
                            message: 'User is not verified yet'
                        })
                    } else {
                        const subject = 'Kindly RE-VERIFY'
                        const link = `${req.protocol}://${req.get('host')}/api/verify/${user._id}/${token}`
                        const message = `Welcome onBoard, kindly use this link ${link} to re-verify your account. Kindly note that this link will expire after 5(five) Minutes.`
                        emailSender({
                            email: user.email,
                            subject,
                            message
                        });
                        res.status(200).json({
                            message: `check ur email for verification mail: ${user.email}`
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.logIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            res.status(404).json({
                message: "no user found"
            });
        } else {
            if(!user.isVerified) {
                res.status(400).json({
                    message: "youre not verified"
                })
            } else {
                const isPassword = await bcrypt.compare(password, user.password);
                if(!isPassword) {
                    res.status(400).json({
                        message: "wrong password"
                    });
                } else {
                    const userLogout = await userModel.findByIdAndUpdate(user._id, {islogin: true});
                    const token = await genToken(user);
                    res.status(200).json({
                        message: 'Log in Successful',
                        token: token
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};



const signOut = async(req, res)=>{
    try {
        const {id} = req.params;
        token = ' ';
        const userLogout = await userModel.findByIdAndUpdate(id, {token: token}, {islogin: false});
        const logout = await userModel.findByIdAndUpdate(id, {islogin: false});

        if(!userLogout) {
            res.status(400).json({
                message: "User still logged in"
            })
        } else {
            res.status(200).json({
                message: 'User Successfully logged out',
                data: userLogout
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}



exports.genToken = async(user)=>{
    const token = await jwt.sign({
        userId: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, {expiresIn: '5m'})
    return token
};


