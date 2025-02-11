const db = require('../../models/database')



const getDepartmentsData = (req, res) => {

  const sql = `select dc.department_name , dc.state , u.full_name from department_coordinators as dc , users as u where dc.dep_coordinator_id = u.email;`
  try {
    db.query(sql, (error, results) => {
      if (error) {
        console.log('error executing get department data query : ', error);
      }

      if (results) {
        console.log(results);
        res.send(results)
      }
    })
  } catch (error) {
    console.log('error getting department data from backend : ', error);
  }
}


module.exports = {
  getDepartmentsData
}