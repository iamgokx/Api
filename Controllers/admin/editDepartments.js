const db = require('../../models/database')

const editDepartmentData = (req, res) => {
  const { department } = req.body;
  console.log(department);
  try {

    const sql = `SELECT dc.*, u.full_name
FROM department_coordinators dc
JOIN users u ON dc.dep_coordinator_id = u.email
WHERE dc.department_name = ?`
    db.query(sql, [department], (error, results) => {
      if (error) {
        console.log('error executing get department data : ', error);
      }

      if (results.length > 0) {
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