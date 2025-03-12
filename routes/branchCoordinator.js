const express = require('express')
const db = require('../models/database')
const { addNewAnnouncement } = require('../Controllers/branchCoordinator/makeAnnouncement')
const branchCoordinator = express.Router();
const { getSubscribers } = require('../Controllers/branchCoordinator/subscribers')
const { getSubBranchCoordinators } = require('../Controllers/branchCoordinator/subBranchCoordinators')
const { addSubBranchCoordinator } = require('../Controllers/branchCoordinator/addSubBranchCoordinator')
const { govAnnouncementMulter } = require('../middlewares/govAnnouncementMulter')


branchCoordinator.post(
  "/newAnnouncement",
  govAnnouncementMulter.fields([
    { name: "media", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  addNewAnnouncement
);




branchCoordinator.post('/getSubscribers', getSubscribers)
branchCoordinator.post('/getSubBranchCoordinators', getSubBranchCoordinators)
branchCoordinator.post('/addSubBnanchCoordinator', addSubBranchCoordinator)

module.exports = {
  branchCoordinator
}