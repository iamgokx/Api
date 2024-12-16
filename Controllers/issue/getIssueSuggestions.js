const db = require('../../models/database')
const getIssueSuggestions = (req, res) => {
  const { issue_id } = req.body;

  const sqlGetSuggestions = `SELECT 
    issues_suggestions.*,
    CONCAT(users.first_name, ' ', users.last_name) AS full_name
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

module.exports = { getIssueSuggestions }