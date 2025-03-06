const db = require('../../models/database')

const getCitizensData = (req, res) => {
  console.log('getting req for get citizens data');
  try {
    const sql = `SELECT 
    u.email, 
    u.full_name, 
    u.phone_number, 
    ca.aadhar_number, 
    c.registration_date_time, 
    c.status, 
    c.locality, 
    c.pincode, 
    c.picture_name, 
    c.link
FROM users u
JOIN citizen_aadhar_number ca ON u.email = ca.citizen_id
JOIN citizens c ON ca.aadhar_number = c.aadhar_number
WHERE u.user_type = 'citizen';
`

    db.query(sql, (error, results) => {
      if (error) {
        console.log('error executing get citizens query');
      }

      if (results) {
        console.log(results);
        res.send(results);
      }
    })
  } catch (error) {
    console.log('error getting citiznes data');
  }
}

module.exports = {
  getCitizensData
}