const User = require("../model/userModel")
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const accountSid = "AC9324dde9c04ec313bc7dc6b7fc4e871a";
const authToken = "58ebce3dc759dfcab89fd1a4fff9325d";
const verifySid = "VA0764cf0e7272b82f4261a869905fa90c";

const jwt = require("jsonwebtoken")
const client = require("twilio")(accountSid, authToken);

const { IPinfoWrapper } = require("node-ipinfo");

const ipinfo = new IPinfoWrapper("2fa612233a7cb1");

ipinfo.lookupIp("1.1.1.1").then((response) => {
    console.log(response.countryCode);
    console.log(response.city);
});



















let USER
const OTP = asyncHandler( async (req, res)=>{
    const { otp } = req.body;
   
    client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: "+919340050305", code: otp })
            .then((verification_check) => res.send(verification_check.status))

          
    

  }
)


const loginUser = asyncHandler( async (req, res)=>{
    const { email, password } = req.body;
  
    if(!email || !password){
        res.status(400)
        throw new Error("all filed all mandatory")

    }

    


    const user = await User.findOne({email});
    
    if( user && (await bcrypt.compare(password, user.password))) {
        console.log("true")
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: "15m"}
        );
        
        res.json({accessToken})
    }else {
        res.status(400).json({message:"username or password is  not valid"})
    }
   
    
    
    
}
)


const registerUser = asyncHandler( async (req, res)=>{
    const {username , email, password} = req.body;

    if(!username || !email || !password){
        res.status(400)
        throw new Error("all filed all mandatory")
        
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable) {
        res.status(400)
        throw new Error("user already register")
        
    }


    USER = new User({
        username,
        email,
        password
    })
    /*
    //hasing password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password:hashedPassword,
    })

    console.log(`user created ${user}`)
    if(user){
        res.status(201).json({_id: user.id, email: user.email})
    }else{
        res.status(400);
        throw new Error("user not created")
    }
    */

    client.verify.v2
        .services(verifySid)
        .verifications.create({ to: "+919340050305", channel: "sms" })
        .then((verification) => console.log(verification.status))

    res.status(200).json({message:USER})
})




const currentUser = asyncHandler(async(req, res)=>{
    res.json(req.user);

} );

module.exports = {registerUser, loginUser,currentUser , OTP}