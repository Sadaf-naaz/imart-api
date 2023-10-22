const router =require("express").Router();
const User=require("../models/User")
const CryptoJS = require("crypto-js");
const jwt=require("jsonwebtoken");


// Register
router.post("/register",async (req,res)=>{
    const newUser=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        username:req.body.username,
        email:req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
          ).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
      } catch (err) {
        res.status(500).json(err);
      }
});



const generateAccessToken = (user) => {
    return jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
    },process.env.JWT_SEC,{expiresIn:"3d"});
  };
  
//   const generateRefreshToken = (user) => {
//     return jwt.sign({
//         id: user._id,
//         isAdmin: user.isAdmin
//     },process.env.JWT_SEC_REFRESH,{expiresIn:"10s"});
//   };

// Login
router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username});

        if(!user){res.status(401).json("Wrong User Name");return;}

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );


        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        
        if(Originalpassword != inputPassword){
            res.status(401).json("Wrong Password");
            return;
        }

        // jwt.sign returns JsonWebToken as string
        const acessToken = generateAccessToken(user);
    // const refreshToken = generateRefreshToken(user);

        // to prevent password to display. others consist everything except password.
        const {password, ...others} = user._doc;

        res.status(200).json({...others, acessToken});

        }catch(err){
        res.status(500).json(err);
    }

});




module.exports= router;