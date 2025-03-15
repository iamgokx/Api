const db = require('../../models/database')

const getDepartmentCoordinators = (req, res) => {
  try {
    const sql = `SELECT 
    u.*,  
    dc.department_id,
    dc.department_name,
    dc.state
FROM department_coordinators dc
JOIN users u ON dc.dep_coordinator_id = u.email
WHERE u.user_type = 'department_coordinator';`

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
  getDepartmentCoordinators
}