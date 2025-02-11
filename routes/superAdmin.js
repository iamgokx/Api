const express = require('express')
const { getUserGraphData, getUserGraphDataAllUsers } = require('../Controllers/admin/getUserGraphData')
const { getDepartmentsData } = require('../Controllers/admin/getDepartmentsData')
const adminRouter = express.Router()

adminRouter.post('/userGraphData', getUserGraphData)
adminRouter.post('/userGraphDataAllUsers', getUserGraphDataAllUsers)
adminRouter.post('/getDepartmentsData', getDepartmentsData)


module.exports = {
  adminRouter
}

