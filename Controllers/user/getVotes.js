const db = require('../../models/database')


const getUserVotes = (req, res) => {
  const { email } = req.body
  console.log('email for getting votes: ', email);

  try {

    const sqlGetUserVotes = `SELECT 
    i.issue_id,
    i.citizen_id,
    i.title,
    i.issue_status,
    i.locality,
    i.pincode,
    im.file_name,
    im.link,
    d.department_name
FROM 
    issues i
JOIN 
    citizen_issues_votes civ ON i.issue_id = civ.issue_id
LEFT JOIN 
    issues_media im ON im.issue_id = i.issue_id 
    AND im.file_name = (
        SELECT file_name FROM issues_media 
        WHERE issues_media.issue_id = i.issue_id 
        ORDER BY file_name ASC LIMIT 1
    )
LEFT JOIN 
    department_coordinators d ON i.department_id = d.department_id
WHERE 
    civ.citizen_id = (SELECT aadhar_number FROM citizen_aadhar_number WHERE citizen_id = ?)`

    db.query(sqlGetUserVotes, [email], (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no results for user votes');
        res.send({ status: false })
      }
    })
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  getUserVotes
}