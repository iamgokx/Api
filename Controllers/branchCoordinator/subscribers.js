const db = require('../../models/database')

const getSubscribers = (req, res) => {
  const { email } = req.body
  console.log('email: ', email);

  try {
    const sql = `SELECT u.full_name, u.email, u.phone_number, c.*
FROM citizens c
JOIN department_subscribers ds ON c.aadhar_number = ds.citizen_id
JOIN citizen_aadhar_number ca ON c.aadhar_number = ca.aadhar_number
JOIN users u ON ca.citizen_id = u.email
WHERE ds.department_id = (
    SELECT department_id 
    FROM department_coordinators 
    WHERE dep_coordinator_id =?);`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log('error executing get subscriber details ', error);

      }

      if (results.length > 0) {
        console.log('results for subscribers ', results);
        res.send({ status: true, results })
      } else {
        console.log('no data for this department ');
        res.send({ status: false })
      }
    })
  } catch (error) { console.log(error); }
}

module.exports = {
  getSubscribers
}