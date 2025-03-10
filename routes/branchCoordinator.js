const express = require('express')
const db = require('../models/database')
const {addNewAnnouncement} = require('../Controllers/branchCoordinator/makeAnnouncement')
const branchCoordinator = express.Router();

//need updates on approved and rejected issues
branchCoordinator.post('/newAnnouncement', addNewAnnouncement)

module.exports = {
  branchCoordinator
}