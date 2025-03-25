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
const { getUserIssues } = require('../Controllers/issue/getIssue')
const { subscribe, unSubscribe, getUserSubscriptions, getCitizenId } = require('../Controllers/user/subscribtions')
const { getUserVotes } = require('../Controllers/user/getVotes')
const { setNewUserPassword } = require('../Controllers/user/newPassword')
const { getPendingFeedback, addFeedback, getRepliedFeedback } = require('../Controllers/user/feedback.js');
const { getProfileIssueSuggestions, getProfileCitizenProposalSuggestions, getProfileGovProposalSuggestions } = require('../Controllers/user/suggestions.js');
const { deleteAccount } = require('../Controllers/user/deleteAccount.js');
router.post('/getUser', userLogIn);
router.get('/otp', userRequestsOtp);
router.get('/otp/verify', verifyOtp);

router.post('/verifyUser', verifyUserSignup)
router.post('/generateJwt', generateJWT)
router.post('/verifyJwt', verifyJwt)
router.post('/submitIssue', upload.array("media"), submitIssue)
router.post('/getAadharDetails', getAadharDetails)
router.post('/getProfilePicture', getProfilePicture)
router.post('/pfpUpload', profileUpload.array('image'), uploadPfp)
router.post('/getUserIssues', getUserIssues)
router.post('/getUserSubscriptions', getUserSubscriptions)
router.post('/subscribe', subscribe)
router.post('/unSubscribe', unSubscribe)
router.post('/getCitizenId', getCitizenId)
router.post('/getUserVotes', getUserVotes)
router.post('/setNewPassword', setNewUserPassword)

router.post('/getPendingFeedback', getPendingFeedback)

router.post('/sendFeedback', addFeedback)
router.post('/getRepliedFeedback', getRepliedFeedback)

router.post('/getIssueProfileSuggestions', getProfileIssueSuggestions)
router.post('/getProfileCitizenProposalSuggestions', getProfileCitizenProposalSuggestions)
router.post('/getProfileGovProposalSuggestions', getProfileGovProposalSuggestions)


router.post('/deleteAccount',deleteAccount)

module.exports = { router }