const db = require('../../models/database')

const getSubBranchCoordinators = (req, res) => {
  const { email } = req.body
  console.log('email for get sub branch coordinators : ', email);
  try {
    const sql = `SELECT 
    sdc.*, 
    u.full_name, 
    dc.department_name, 
    GROUP_CONCAT(sdp.pincode ORDER BY sdp.pincode SEPARATOR ', ') AS pincodes
FROM sub_department_coordinators sdc  
JOIN department_coordinators dc ON sdc.department_id = dc.department_id  
JOIN users u ON sdc.sub_department_coordinator_id = u.email  
LEFT JOIN sub_dep_coordinator_pincodes sdp ON sdc.sub_department_coordinator_id = sdp.sub_department_coordinator_id
WHERE dc.dep_coordinator_id = ?
GROUP BY sdc.sub_department_coordinator_id;
`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log('error getting sub branch coordinators', error);
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no sub branch coordinators');
        res.send({ status: false })
      }
    })
  }
  catch (error) {
    console.log('error: ', error);

  }
}

module.exports = {
  getSubBranchCoordinators
}