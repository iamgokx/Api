const express = require('express')
const { insertUserProposal } = require('../Controllers/proposals/userProposal')
const { ProposalUpload } = require('../middlewares/proposalUserMulter')
const { getUserProposals,getUserDetailedProposals,getUserPersonalProposals } = require('../Controllers/proposals/getProposals')
const proposalRouter = express.Router();


proposalRouter.post('/insertUserProposal', ProposalUpload.fields([
  { name: "media", maxCount: 5 },
  { name: "documents", maxCount: 5 }]), insertUserProposal)

proposalRouter.post('/getCitizenProposals', getUserProposals)
proposalRouter.post('/getUserPersonalProposals', getUserPersonalProposals)
proposalRouter.post('/getCitizenDetailedProposal', getUserDetailedProposals)
module.exports = {
  proposalRouter
}