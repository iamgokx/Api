const express = require('express')
const db = require('../models/database')
const { getIssues, getDetailedIssue } = require('../Controllers/issue/getIssue')
const { getIssueVotes ,addIssueVote} = require('../Controllers/issue/getIssueVotes')
const issueRouter = express.Router();

//need updates on approved and rejected issues
issueRouter.post('/getIssues', getIssues)
issueRouter.post('/getDetailedIssue', getDetailedIssue)
issueRouter.get('/getIssueVotes', getIssueVotes)
issueRouter.post('/addVote',addIssueVote )
module.exports = {
  issueRouter
}