const db = require('../../models/database')

const getSubDepartmentCoordinators = (req, res) => {
  try {
    const sql = `SELECT 
    u.email AS sub_coordinator_email,
    u.full_name,
    u.phone_number,
    u.user_type,
    sdc.department_id,
    sdc.latitude,
    sdc.longitude,
    dc.department_name,
    dc.state
FROM sub_department_coordinators sdc
JOIN users u ON sdc.sub_department_coordinator_id = u.email
JOIN department_coordinators dc ON sdc.department_id = dc.department_id
WHERE u.user_type = 'sub_branch_coordinator';`

    db.query(sql, (err, results) => {
      if (err) {
        console.error('error executing get department coordinators details , ', err);
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no results found for get department coordinators ');
        res.send({ status: false })
      }
    })
  }
  catch (error) {
    console.log(error);
  }
}

module.exports = {
  getSubDepartmentCoordinators
}