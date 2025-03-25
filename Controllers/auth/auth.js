const db = require('../../models/database')

const userLogIn = (req, res) => {
  const { email, password } = req.body;


  const query = "SELECT * FROM users WHERE BINARY  email = ? AND BINARY user_password = ?";

  db.query(query, [email, password], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      const user = results[0];
      console.log('user: ', user);
      console.log('user: ', user.user_type);

      if (user.user_type == 'citizen') {
        const sqlCheckCitizenStatus = `select status from citizens where aadhar_number = (select aadhar_number from citizen_aadhar_number where citizen_id = ?);`

        db.query(sqlCheckCitizenStatus, [user.email], (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (results.length > 0) {
            console.log(results[0].status);
            if (results[0].status == 'approved') {
              console.log('user status is : ', results[0].status);
              return res.status(200).json(user);
            } else {
              return res.status(404).json({ message: 'User not found' });
            }
          }
        })
      } else {

        return res.status(200).json(user);
      }
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
}



module.exports = {
  userLogIn,

}