const db = require('../../models/database')

const getIssues = (req, res) => {
  try {
    const { email } = req.body
    console.log('email: ', email);

    //find dep id

    const sqlFindDepId = `select department_id from sub_department_coordinators where sub_department_coordinator_id = ?;`

    db.query(sqlFindDepId, [email], (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length > 0) {
        console.log(results);
        const depId = results[0].department_id
        console.log('depId: ', depId);


        const sqlGetIssuesForSubDep = `SELECT 
    i.issue_id,
    i.title, 
    i.issue_status, 
    i.priority,
    i.date_time_created, 
    ip.state, 
    ip.city, 
    ip.pincode,
    COALESCE(GROUP_CONCAT(im.file_name SEPARATOR ', '), '') AS file_names
FROM issues i
JOIN issues_pincode ip ON i.pincode = ip.pincode
LEFT JOIN issues_media im ON i.issue_id = im.issue_id
LEFT JOIN reports r ON i.issue_id = r.issue_id  
JOIN sub_dep_coordinator_pincodes scp ON i.pincode = scp.pincode  
WHERE scp.sub_department_coordinator_id = ?
AND r.issue_id IS NULL  
GROUP BY i.issue_id;

`


        db.query(sqlGetIssuesForSubDep, [email], (error, results) => {
          if (error) {
            console.log(error);
          }
          if (results.length > 0) {
            console.log('completed issues without report , ', results);
            res.send({ status: true, results })
          } else {
            console.log('no results for this dep');
            res.send({ status: false, message: 'No issues found for this department' })
          }
        })
      } else {
        console.log('no results for finding result id');
      }
    })

  } catch (error) { console.log(error); }
}


const getIssuesWithReports = (req, res) => {
  try {
    const { email } = req.body
    console.log('email: ', email);

    //find dep id

    const sqlFindDepId = `select department_id from sub_department_coordinators where sub_department_coordinator_id = ?;`

    db.query(sqlFindDepId, [email], (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length > 0) {
        console.log(results);
        const depId = results[0].department_id
        console.log('depId: ', depId);


        const sqlGetIssuesForSubDep = `SELECT 
    i.issue_id,
    i.title, 
    i.issue_status, 
    i.priority,
    i.date_time_created, 
    ip.state, 
    ip.city, 
    ip.pincode,
    COALESCE(GROUP_CONCAT(im.file_name SEPARATOR ', '), '') AS file_names,
    r.title AS report_title,
    r.report_description,
    r.date_time_created AS report_created_at
FROM issues i
JOIN issues_pincode ip ON i.pincode = ip.pincode
LEFT JOIN issues_media im ON i.issue_id = im.issue_id
JOIN reports r ON i.issue_id = r.issue_id  -- Ensuring only issues that have reports are included
WHERE i.department_id = ?
AND i.issue_status = 'completed'
GROUP BY i.issue_id, r.title, r.report_description, r.date_time_created;

`


        db.query(sqlGetIssuesForSubDep, [depId], (error, results) => {
          if (error) {
            console.log(error);
          }
          if (results.length > 0) {
            console.log('completed issues without report , ', results);
            res.send({ status: true, results })
          } else {
            console.log('no results for this dep');
            res.send({ status: false, message: 'No issues found for this department' })
          }
        })
      } else {
        console.log('no results for finding result id');
        res.send({ status: false, message: 'could not find results ' })
      }
    })

  } catch (error) { console.log(error); }
}

module.exports = {
  getIssues, getIssuesWithReports
}