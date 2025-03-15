const db = require('../../models/database')
const { getIO } = require('../socket/socketManager')
const getGovProposalSuggestions = (req, res) => {
  const { proposalId } = req.body
  console.log('gov proposal id: ', proposalId);
  try {
    const sqlGetGovProposalSuggestions = `SELECT 
    gps.gov_proposal_id,
    gps.citizen_id,
    gps.content AS suggestion_content,
    gps.date_time_created,
    gps.is_anonymous,
    u.full_name AS citizen_name,
    c.picture_name AS citizen_picture_name
FROM 
    gov_proposals_suggestions gps
JOIN 
    citizen_aadhar_number can ON gps.citizen_id = can.citizen_id
JOIN 
    citizens c ON can.aadhar_number = c.aadhar_number
JOIN 
    users u ON can.citizen_id = u.email
WHERE 
    gps.gov_proposal_id =?
`

    db.query(sqlGetGovProposalSuggestions, [proposalId], (error, results) => {
      if (error) {
        console.log('error executing query of getting citizenProposalSuggestion  :', error);
      }

      if (results.length > 0) {
        console.log(results);
        res.json(results)
      } else {
        res.json({ message: 'No Suggestions for this Project Idea' })
      }
    })
  } catch (error) {
    console.log('get proposal suggestion error : ', error);
  }
}

const insertGovProposalSuggestion = (req, res) => {
  const { proposalId, email, userSuggestion, isanonymous } = req.body
  console.log('isanonymous: ', isanonymous);
  console.log('userSuggestion: ', userSuggestion);
  console.log('email: ', email);
  console.log('proposalId: ', proposalId);

  try {
    const sqlInsertSuggestion = `insert into gov_proposals_suggestions (gov_proposal_id,citizen_id,content,is_anonymous) values (?,?,?,?)`

    db.query(sqlInsertSuggestion, [proposalId, email, userSuggestion, isanonymous], (error, results) => {
      if (error) {
        console.log('error executing insert suggestion query : ', error);
      }

      if (results.affectedRows > 0) {
        const io = getIO();
        const data = {
          message: proposalId,
        }
        io.emit('newSuggestionProposal', data)
        res.json({ message: 'inserted suggestion' })
      }
    })

  } catch (error) {
    console.log('error inserting citizen suggestion : ', error);
  }

}

module.exports = {
  getGovProposalSuggestions, insertGovProposalSuggestion
}