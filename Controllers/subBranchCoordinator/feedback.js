const db = require('../../models/database')

const getDepFeedback = (req, res) => {
  try {
    const { email } = req.body

    const sql = `
   SELECT 
    i.issue_id,
    i.title AS issue_title,
    i.issue_description,
    i.feedback_text,
    i.rating,
    i.pincode,
    i.date_time_submitted,

    -- Sub-department coordinator details
    sdc.sub_department_coordinator_id,
    u.full_name AS sub_branch_coordinator_name,
    d.department_name,

    -- Citizen who reported the issue
    issue_user.email AS issue_creator_email,
    issue_user.full_name AS issue_creator_name,
    issue_user.phone_number AS issue_creator_phone,
    c.picture_name AS issue_creator_picture_name,
    c.link AS issue_creator_picture_link,

    -- Media file names associated with the issue (comma-separated)
    COALESCE(GROUP_CONCAT(im.file_name ORDER BY im.file_name SEPARATOR ','), '') AS media_files

FROM issues i
JOIN sub_dep_coordinator_pincodes sp ON i.pincode = sp.pincode
JOIN sub_department_coordinators sdc ON sp.sub_department_coordinator_id = sdc.sub_department_coordinator_id
JOIN department_coordinators d ON sdc.department_id = d.department_id
JOIN users u ON sdc.sub_department_coordinator_id = u.email

-- Get the citizen who reported the issue
JOIN users issue_user ON i.citizen_id = issue_user.email  

-- Get the citizen's Aadhaar number
LEFT JOIN citizen_aadhar_number ca ON issue_user.email = ca.citizen_id

-- Get the profile picture from the citizens table
LEFT JOIN citizens c ON ca.aadhar_number = c.aadhar_number

-- Get media files related to the issue
LEFT JOIN issues_media im ON i.issue_id = im.issue_id

WHERE i.issue_status = 'completed' 
AND i.feedback_text IS NOT NULL 
AND i.rating IS NOT NULL
AND sdc.sub_department_coordinator_id =?

GROUP BY i.issue_id  -- Ensures media files are grouped per issue
ORDER BY i.date_time_submitted DESC;

     `

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log('something went wrong ', error);
        res.send({ status: false, message: 'Somethign went wrong, please try again later...' })
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no results for this sub dep coordinator');
        res.send({ status: false, message: 'No feedback data for this sub department coordinator' })
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: 'Sorry something went wrong, please try again later' })
  }
}

module.exports = {
  getDepFeedback
}