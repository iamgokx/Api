const db = require('../../models/database')

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

module.exports = {
  getPendingFeedback
}