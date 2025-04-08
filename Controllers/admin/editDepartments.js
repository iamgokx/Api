const db = require('../../models/database')

const editDepartmentData = (req, res) => {
  const { department } = req.body;
  console.log(department);
  try {

    const sql = `SELECT 
  dc.department_id,
  dc.dep_coordinator_id,
  dc.department_name,
  dc.state,
  u.full_name,
  u.email,
  u.user_password,
  u.phone_number,
  u.user_type
FROM department_coordinators dc
JOIN users u ON dc.dep_coordinator_id = u.email
WHERE dc.department_name = ?`
    db.query(sql, [department], (error, results) => {
      if (error) {
        console.log('error executing get department data : ', error);
      }

      if (results.length > 0) {
        console.log('edit dep details :  ', results);
        res.send(results)
      }
    })
  } catch {
    console.log('error getting department data : ', error);
  }
}

const setNewDepartmentData = (req, res) => {
  console.log('receiving reqest for new department data');
}

module.exports = {
  editDepartmentData
}