const db = require('../../models/database');


const getPendingFeedback = (req, res) => {
  try {
    const { email } = req.body
    console.log('email: ', email);

    const sqlGetPendingFeeback = `SELECT 
    i.issue_id,
    i.title,
    i.issue_description,
    i.issue_status,
    i.date_time_created,
    i.locality,
    i.pincode,
    p.city,
    d.department_name,
    SUBSTRING_INDEX(GROUP_CONCAT(im.file_name ORDER BY im.file_name SEPARATOR ', '), ',', 1) AS media_file
FROM issues i
LEFT JOIN department_coordinators d ON i.department_id = d.department_id
LEFT JOIN issues_media im ON i.issue_id = im.issue_id
LEFT JOIN issues_pincode p ON i.pincode = p.pincode  -- Join to get city
WHERE i.citizen_id = ?
AND i.issue_status = 'completed' 
AND (i.feedback_text IS NULL OR i.rating IS NULL)
GROUP BY i.issue_id, d.department_name, p.city, i.pincode;
`


    db.query(sqlGetPendingFeeback, [email], (error, results) => {

      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        console.log('pending feeback ');
        console.log(results);
        res.send({ status: true, results })
      } else {
        res.send({ status: false, message: 'No Pending feedback for user' })
      }
    })
  } catch (error) { console.log(error); }
}



const addFeedback = (req, res) => {
  try {
    const { issueId, feedback, ratings } = req.body

    const sql = `UPDATE issues 
SET 
    rating = ?, 
    feedback_text = ?, 
    date_time_submitted = NOW() 
WHERE 
    issue_id = ?;
    `

    db.query(sql, [ratings, feedback, issueId], (error, results) => {
      if (error) {
        console.log('error executing insert feedback , ', error);
        res.send({ status: false, message: 'error adding feedback, please try again in some time..' })
      }

      if (results.affectedRows > 0) {
        console.log('added feedback');
        res.send({ status: true, message: 'Feedback submitted successfully...' })
      } else {
        console.log('Could not add feedback');
        res.send({ status: false, message: 'Could not submit adding feedback' })
      }
    })
  } catch (error) {
    console.log(error);
  }
}


const getRepliedFeedback = (req, res) => {
  try {
    const { email } = req.body

    const sql = `SELECT 
    i.issue_id,
    i.title,
    i.issue_description,
    i.issue_status,
    i.date_time_created,
    i.locality,
    i.pincode,
    p.city,
    d.department_name,
    i.feedback_text,
    i.rating,
    i.date_time_submitted,
    SUBSTRING_INDEX(GROUP_CONCAT(im.file_name ORDER BY im.file_name SEPARATOR ', '), ',', 1) AS media_file
FROM issues i
LEFT JOIN department_coordinators d ON i.department_id = d.department_id
LEFT JOIN issues_media im ON i.issue_id = im.issue_id
LEFT JOIN issues_pincode p ON i.pincode = p.pincode
WHERE i.citizen_id = ?
AND i.issue_status = 'completed'
AND i.feedback_text IS NOT NULL 
AND i.rating IS NOT NULL
GROUP BY i.issue_id, d.department_name, p.city, i.pincode, i.feedback_text, i.rating, i.date_time_submitted;

`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again later....' })
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      }
    })

  } catch (error) {
    console.log(error);
    res.send({ status: false, message: 'Somethign went wrong, try again later...' })
  }
}




module.exports = {
  getPendingFeedback, addFeedback, getRepliedFeedback
}