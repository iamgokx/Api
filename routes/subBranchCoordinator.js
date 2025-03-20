const express = require('express')
const db = require('../models/database')
const { getIssues, getIssuesWithReports } = require('../Controllers/subBranchCoordinator/getIssues')
const { updateIssue, setEstimateCompleteTime, updateDepartmentId } = require('../Controllers/subBranchCoordinator/updateIssueStatusPriority')
const { deleteIssue } = require('../Controllers/subBranchCoordinator/deleteIssue')
const { makeReport } = require('../Controllers/subBranchCoordinator/makeReport')
const { reportMulter } = require('../middlewares/reportsMulter')
const { getDepFeedback } = require('../Controllers/subBranchCoordinator/feedback')


const subBranchCoordinator = express.Router();

subBranchCoordinator.post('/makeReport', reportMulter.fields([
  { name: "media", maxCount: 5 },
  { name: "documents", maxCount: 5 }]), makeReport)


subBranchCoordinator.post('/getIssues', getIssues);
subBranchCoordinator.post('/getIssuesWithReports', getIssuesWithReports);
subBranchCoordinator.post('/updateIssueStatusPriority', updateIssue)
subBranchCoordinator.post('/updateDepId', updateDepartmentId)

subBranchCoordinator.post('/deleteIssue', deleteIssue)

subBranchCoordinator.post('/getFeedback', getDepFeedback)

subBranchCoordinator.post('/setEstimateTimeComplete',setEstimateCompleteTime)



module.exports = {
  subBranchCoordinator
}