const express = require('express')
const db = require('../models/database')
const { addNewAnnouncement } = require('../Controllers/branchCoordinator/makeAnnouncement')
const branchCoordinator = express.Router();
const { getSubscribers } = require('../Controllers/branchCoordinator/subscribers')
const { getSubBranchCoordinators } = require('../Controllers/branchCoordinator/subBranchCoordinators')
const { addSubBranchCoordinator } = require('../Controllers/branchCoordinator/addSubBranchCoordinator')
const { govAnnouncementMulter } = require('../middlewares/govAnnouncementMulter')
const { govProposalMulter } = require('../middlewares/govProposalMulter')
const { addProposal } = require('../Controllers/branchCoordinator/addGovProposal')
const { getReports } = require('../Controllers/branchCoordinator/getReports')
const { getReportsChartData, getCompletionChartData, getIssuePriorityChartData, getIssueStatusChartData } = require('../Controllers/branchCoordinator/graphData')

branchCoordinator.post(
  "/newAnnouncement",
  govAnnouncementMulter.fields([
    { name: "media", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  addNewAnnouncement
);

branchCoordinator.post(
  "/newProposal",
  govProposalMulter.fields([
    { name: "media", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  addProposal
);


branchCoordinator.post('/getSubscribers', getSubscribers)

branchCoordinator.post('/getSubBranchCoordinators', getSubBranchCoordinators)

branchCoordinator.post('/addSubBnanchCoordinator', addSubBranchCoordinator)

branchCoordinator.post('/getReports', getReports)

branchCoordinator.post('/getReportsChartData', getReportsChartData)

branchCoordinator.post('/getissueStatusChartData', getIssueStatusChartData)

branchCoordinator.post('/getCompletionChartData', getCompletionChartData)

branchCoordinator.post('/getIssuePriorityChartData', getIssuePriorityChartData)





module.exports = {
  branchCoordinator
}