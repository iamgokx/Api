const express = require('express')
const { insertUserProposal } = require('../Controllers/proposals/userProposal')
const { ProposalUpload } = require('../middlewares/proposalUserMulter')
const proposalRouter = express.Router();


proposalRouter.post('/insertUserProposal', ProposalUpload.fields([
  { name: "media", maxCount: 5 },
  { name: "documents", maxCount: 5 }]), insertUserProposal)

module.exports = {
  proposalRouter
}