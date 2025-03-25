const express = require('express')
const db = require('../models/database')

const announcementsRouter = express.Router();
const { getAnnouncementsForUser, getDetailedAnnouncement, getSubscriptionsAnnouncements } = require('../Controllers/announcements/getAnnouncements')



announcementsRouter.post('/getAnnouncements', getAnnouncementsForUser)
announcementsRouter.post('/getAnnouncementsDetailed', getDetailedAnnouncement)

announcementsRouter.post('/getsubscriptions', getSubscriptionsAnnouncements)



module.exports = {
  announcementsRouter
}