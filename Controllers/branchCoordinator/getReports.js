const db = require('../../models/database')


const getReports = (req, res) => {
  try {
    const { email } = req.body
    console.log('email: ', email);

    const sqlGetIssuesForSubDep = `SELECT 
    i.issue_id,
    i.title, 
    i.issue_status, 
    i.priority,
    i.date_time_created, 
    ip.state, 
    ip.city, 
    ip.pincode,
    -- Combine both issue media and report media into a single column
    COALESCE(GROUP_CONCAT(DISTINCT im.file_name SEPARATOR ', '), '') AS issue_media_files,
    COALESCE(GROUP_CONCAT(DISTINCT rm.file_name SEPARATOR ', '), '') AS report_media_files,
    r.title AS report_title,
    r.report_description,
    r.date_time_created AS report_created_at,
    sdc.sub_department_coordinator_id  
FROM issues i
JOIN issues_pincode ip ON i.pincode = ip.pincode
LEFT JOIN issues_media im ON i.issue_id = im.issue_id
JOIN reports r ON i.issue_id = r.issue_id
LEFT JOIN reports_media rm ON r.issue_id = rm.report_id  
JOIN sub_department_coordinators sdc ON r.sub_branch_coordinator_id = sdc.sub_department_coordinator_id  
WHERE i.department_id = (
    SELECT department_id FROM department_coordinators WHERE dep_coordinator_id = ?
) 
AND i.issue_status = 'completed'
GROUP BY i.issue_id, r.title, r.report_description, r.date_time_created, sdc.sub_department_coordinator_id;


`


    db.query(sqlGetIssuesForSubDep, [email], (error, results) => {
      if (error) {
        console.log(error);
      }
      if (!results) {
        console.log('no results for reports for branch coordinator');
        res.send({ status: false, message: 'no results for reports , for branch coordinator' })
      }
      if (results.length > 0) {
        console.log('completed issues without report , ', results);
        res.send({ status: true, results })
      } else {
        console.log('no results for this dep');
        res.send({ status: false, message: 'No issues found for this department' })
      }
    })



  } catch (error) { console.log(error); }
}




module.exports = {
  getReports
}