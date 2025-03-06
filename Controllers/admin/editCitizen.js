const db = require('../../models/database')

const editCitizen = async (req, res) => {
  try {
console.log();
console.log('loading details of citizen');
    const { email } = req.body
    const sql = `SELECT c.*, u.*
FROM citizens c
JOIN citizen_aadhar_number ca ON c.aadhar_number = ca.aadhar_number
JOIN users u ON ca.citizen_id = u.email
WHERE ca.citizen_id =  ?;`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log('error executing get detailed citizen details query',error);
      }

      if(results.length > 0){
        console.log(results);
        res.send(results)
      }
    })
  }
  catch (error) { 
    console.log('error getting detailed citizen details', error);
  }
}

module.exports = {
  editCitizen
}