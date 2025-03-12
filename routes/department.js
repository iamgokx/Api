const express = require('express')
const db = require('../models/database')

const department = express.Router();
const { getDepartments ,getDepartmentId} = require('../Controllers/Departments/getDepartments')

department.post('/getDepartments', getDepartments)
department.post('/getDepartmentId', getDepartmentId)

module.exports = {
  department
}