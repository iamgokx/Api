const express = require('express')
const db = require('../models/database')

const announcementsRouter = express.Router();
const { getAnnouncementsForUser, getDetailedAnnouncement } = require('../Controllers/announcements/getAnnouncements')



announcementsRouter.post('/getAnnouncements', getAnnouncementsForUser)
announcementsRouter.post('/getAnnouncementsDetailed', getDetailedAnnouncement)

module.exports = {
  announcementsRouter
}