const express = require('express')
const { getUserGraphData, getUserGraphDataAllUsers } = require('../Controllers/admin/getUserGraphData')
const { getDepartmentsData } = require('../Controllers/admin/getDepartmentsData')
const { editDepartmentData } = require('../Controllers/admin/editDepartments')
const { getCitizensData } = require('../Controllers/admin/getCitizensData')
const { editCitizen } = require('../Controllers/admin/editCitizen');
const { getDepartmentCoordinators } = require('../Controllers/admin/getDepartmentCoordinators')
const { getSubDepartmentCoordinators } = require('../Controllers/admin/getSubDepartmetnCoordinators')
const { addBranchCoordinator } = require('../Controllers/admin/addBranchCoordinator')
const { getReportsChartData, getIssueStatusChartData, getCompletionChartData, getIssuePriorityChartData } = require('../Controllers/admin/graphsData')
const { updateDepartmentName, updateDepCoordName, updateDepCoordEmail, getDepNameLogs, getDepCoordNameLogs, getDepCoordEmailLogs, updateDepPhoneNumber, getDepCoordPhoneLogs } = require('../Controllers/admin/updateDepartment')
const { approveProposal, rejectProposal } = require('../Controllers/admin/proposals')
const adminRouter = express.Router()

adminRouter.post('/userGraphData', getUserGraphData)
adminRouter.post('/userGraphDataAllUsers', getUserGraphDataAllUsers)
adminRouter.post('/getDepartmentsData', getDepartmentsData)
adminRouter.post('/editDepartment', editDepartmentData)
adminRouter.post('/getCitizens', getCitizensData)
adminRouter.post('/editCitizen', editCitizen)
adminRouter.post('/getDepartmentCoordinators', getDepartmentCoordinators)
adminRouter.post('/getSubDepartmentCoordinators', getSubDepartmentCoordinators)
adminRouter.post('/addBranchCoordinator', addBranchCoordinator)

adminRouter.post('/getReportsChartData', getReportsChartData)
adminRouter.post('/getissueStatusChartData', getIssueStatusChartData)
adminRouter.post('/getCompletionChartData', getCompletionChartData)
adminRouter.post('/getIssuePriorityChartData', getIssuePriorityChartData)

adminRouter.post('/updateDepName', updateDepartmentName)
adminRouter.post('/updateDepCoordName', updateDepCoordName)
adminRouter.post('/updateDepCoordEmail', updateDepCoordEmail)
adminRouter.post('/updateDepPhoneNumber', updateDepPhoneNumber)

adminRouter.post('/approveProposal', approveProposal)
adminRouter.post('/rejectProposal', rejectProposal)

adminRouter.post('/getDepNameLogs', getDepNameLogs)
adminRouter.post('/getDepCoordNameLogs', getDepCoordNameLogs)
adminRouter.post('/getDepCoordEmailLogs', getDepCoordEmailLogs)
adminRouter.post('/getDepCoordPhoneLogs', getDepCoordPhoneLogs)
module.exports = {
  adminRouter
}

