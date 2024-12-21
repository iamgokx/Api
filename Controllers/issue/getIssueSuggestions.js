const db = require('../../models/database')
const { getIO } = require('../socket/socketManager')

const getIssueSuggestions = (req, res) => {
  const { issue_id } = req.body;

  const sqlGetSuggestions = `SELECT 
    issues_suggestions.*,
    users.full_name
FROM 
    issues_suggestions
JOIN 
    citizen_aadhar_number ON issues_suggestions.citizen_id = citizen_aadhar_number.citizen_id
JOIN 
    users ON citizen_aadhar_number.citizen_id = users.email
WHERE 
    issues_suggestions.issue_id = ?;
`
  try {
    db.query(sqlGetSuggestions, [issue_id], (error, results) => {
      if (error) {
        console.log('error executing suggestions query :', error);
      }

      if (results.length > 0) {
        res.json(results)
      } else {
        res.json({ message: 'No suggestions, Be the first one to add one.' })
      }
    })
  } catch (error) {
    console.log('error getting suggestions  :', error);
  }
}

const submitSuggestion = (req, res) => {
  const { issueId, email, userSuggestion, isanonymous } = req.body

  try {
    const sqlAddSuggestion = `
	INSERT INTO issues_suggestions(issue_id,citizen_id,content,is_anonymous) VALUES (?,?,?,?)`

    db.query(sqlAddSuggestion, [issueId, email, userSuggestion, isanonymous], (error, results) => {
      if (error) {
        console.log('error inserting issue suggestion : ', error);
      }

      if (results.affectedRows > 0) {
        const io = getIO();
        const data = {
          message: issueId,
        }
        io.emit('newSuggestion', data)
        res.json({ message: 'success adding suggestion' });
      }
    })
  } catch (error) {
    console.log('error adding suggestion : ', error);
  }
}

module.exports = { getIssueSuggestions, submitSuggestion }

