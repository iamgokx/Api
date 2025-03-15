const express = require('express')
const { getUserGraphData, getUserGraphDataAllUsers } = require('../Controllers/admin/getUserGraphData')
const { getDepartmentsData } = require('../Controllers/admin/getDepartmentsData')
const { editDepartmentData } = require('../Controllers/admin/editDepartments')
const {getCitizensData} = require('../Controllers/admin/getCitizensData')
const {editCitizen} = require('../Controllers/admin/editCitizen');
const {getDepartmentCoordinators} = require('../Controllers/admin/getDepartmentCoordinators')
const {getSubDepartmentCoordinators} = require('../Controllers/admin/getSubDepartmetnCoordinators')
const {addBranchCoordinator} = require('../Controllers/admin/addBranchCoordinator')
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




module.exports = {
  adminRouter
}

