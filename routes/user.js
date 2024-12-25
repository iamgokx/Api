const express = require('express');
const { userLogIn } = require('../Controllers/auth/auth')
const { userRequestsOtp, verifyOtp } = require('../Controllers/auth/otp')
const { verifyUserSignup, getAadharDetails } = require('../Controllers/auth/userSignup')
const { generateJWT, verifyJwt } = require('../Controllers/auth/jwt')
const { getProfilePicture } = require('../Controllers/user/profile')
const router = express.Router();
const { submitIssue } = require('../Controllers/issue/issue')
const upload = require('../middlewares/multer')
const profileUpload = require('../middlewares/profileMulter')
const { uploadPfp } = require('../Controllers/userProfile/pfp')

router.post('/getUser', userLogIn);
router.get('/otp', userRequestsOtp);
router.get('/otp/verify', verifyOtp);
router.post('/verifyUser', verifyUserSignup)
router.post('/generateJwt', generateJWT)
router.post('/verifyJwt', verifyJwt)
router.post('/submitIssue', upload.array("media"), submitIssue)
router.post('/getAadharDetails', getAadharDetails)
router.post('/getProfilePicture', getProfilePicture)
router.post('/uploadProfilePicture',uploadPfp)
module.exports = { router }