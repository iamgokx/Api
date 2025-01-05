const express = require('express')
const db = require('../models/database')
const { getIssues, getDetailedIssue,getMapViewIssues } = require('../Controllers/issue/getIssue')
const { getIssueVotes ,addIssueVote} = require('../Controllers/issue/getIssueVotes')
const issueRouter = express.Router();
const {getIssueSuggestions, submitSuggestion} = require('../Controllers/issue/getIssueSuggestions')

//need updates on approved and rejected issues
issueRouter.post('/getIssues', getIssues)
issueRouter.post('/getIssuesMapView', getMapViewIssues)
issueRouter.post('/getDetailedIssue', getDetailedIssue)
issueRouter.get('/getIssueVotes', getIssueVotes)
issueRouter.post('/addVote',addIssueVote )
issueRouter.post('/getIssueSuggestions',getIssueSuggestions )
issueRouter.post('/submitSuggestion',submitSuggestion )
module.exports = {
  issueRouter
}