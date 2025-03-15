const express = require('express')
const { insertUserProposal } = require('../Controllers/proposals/userProposal')
const { ProposalUpload } = require('../middlewares/proposalUserMulter')
const { getUserProposals, getUserDetailedProposals, getUserPersonalProposals } = require('../Controllers/proposals/getProposals')
const { getCitizenProposalSuggestions, insertCitizenSuggestion } = require('../Controllers/proposals/getCitizenProposalSuggestions')
const { getGovProposals, getGovDetailedProposal,getGovIndividualProposals } = require('../Controllers/proposals/getGovProposals')
const { getGovProposalSuggestions, insertGovProposalSuggestion } = require('../Controllers/proposals/getGovProposalSuggestions')




const proposalRouter = express.Router();

proposalRouter.post('/insertUserProposal', ProposalUpload.fields([
  { name: "media", maxCount: 5 },
  { name: "documents", maxCount: 5 }]), insertUserProposal)

proposalRouter.post('/getCitizenProposals', getUserProposals)
proposalRouter.post('/getUserPersonalProposals', getUserPersonalProposals)
proposalRouter.post('/getCitizenDetailedProposal', getUserDetailedProposals)
proposalRouter.post('/getCitizenProposalSuggestions', getCitizenProposalSuggestions)
proposalRouter.post('/citizenAddProposalSuggestion', insertCitizenSuggestion)

proposalRouter.post('/getGovProposals', getGovProposals)
proposalRouter.post('/getGovProposalsDetailed', getGovDetailedProposal)
proposalRouter.post('/getGovProposalSuggestions', getGovProposalSuggestions)
proposalRouter.post('/govProposalAddSuggestion', insertGovProposalSuggestion)
proposalRouter.post('/getIndividualDepProposals',getGovIndividualProposals)

module.exports = {
  proposalRouter
}