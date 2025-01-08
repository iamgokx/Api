const express = require('express')
const { insertUserProposal } = require('../Controllers/proposals/userProposal')
const { ProposalUpload } = require('../middlewares/proposalUserMulter')
const { getUserProposals, getUserDetailedProposals, getUserPersonalProposals } = require('../Controllers/proposals/getProposals')
const { getCitizenProposalSuggestions,insertCitizenSuggestion } = require('../Controllers/proposals/getCitizenProposalSuggestions')
const proposalRouter = express.Router();


proposalRouter.post('/insertUserProposal', ProposalUpload.fields([
  { name: "media", maxCount: 5 },
  { name: "documents", maxCount: 5 }]), insertUserProposal)

proposalRouter.post('/getCitizenProposals', getUserProposals)
proposalRouter.post('/getUserPersonalProposals', getUserPersonalProposals)
proposalRouter.post('/getCitizenDetailedProposal', getUserDetailedProposals)
proposalRouter.post('/getCitizenProposalSuggestions', getCitizenProposalSuggestions)
proposalRouter.post('/citizenAddProposalSuggestion', insertCitizenSuggestion)
module.exports = {
  proposalRouter
}