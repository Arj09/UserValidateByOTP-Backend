const express  = require("express")
const { registerUser, loginUser, currentUser, client, OTP } = require("../controller/userController")
const validateToken = require("../middleware/validationtokenHandler")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/otp", OTP)
router.get("/current", validateToken, currentUser)


module.exports = router