const db = require('../../models/database')

const deleteAccount = (req, res) => {
  const { email } = req.body
  console.log('email: ', email);

  try {

    const sql = `UPDATE citizens 
SET status = 'pending' 
WHERE aadhar_number = (
    SELECT aadhar_number 
    FROM citizen_aadhar_number 
    WHERE citizen_id = ?
);`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }

      if (results.affectedRows > 0) {
        console.log('set status pending for user  : ', email);
        res.send({
          status: true, message: 'deleted account by setting the user status to pending...'
        })
      } else {
        console.log('could not delete user account');
        res.send({ status: false, message: 'Could not delete user account, please try again later...' })
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: 'Something went wrong, please try again later...' })
  }
}

module.exports = { deleteAccount }