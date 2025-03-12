const db = require('../../models/database')


const getDepartments = (req, res) => {
  try {
    const sql = `select department_id, department_name from department_coordinators;`

    db.query(sql, (error, results) => {
      if (error) {
        console.log(error)
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('No departments');
        res.send({ status: false })
      }
    })
  } catch (error) {
    console.log(error);
  }
}

const getDepartmentId = (req, res) => {
  const { email } = req.body

  try {
    const sql = `select department_id, department_name from department_coordinators where dep_coordinator_id = ?;`


    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log(error)
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      }
      else {
        console.log('could not find department id');
        res.send({ status: false })
      }
    })
  }catch(error){
    console.log(error);
  }
}


module.exports = {
  getDepartments,
  getDepartmentId
}