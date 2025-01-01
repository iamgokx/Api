const db = require('../../models/database')

const getProfilePicture = (req, res) => {
  const { email } = req.body;
  try {
    const sqlFindAadharNumber = `SELECT aadhar_number FROM citizen_aadhar_number WHERE citizen_id = ?`;


    db.query(sqlFindAadharNumber, [email], (error, results) => {
      if (error) {
        console.log('Error finding Aadhar number:', error);
        return res.status(500).send('Database error.');
      }

      if (results.length > 0) {
        const aadharNumber = results[0].aadhar_number;
        console.log('Aadhar number found:', aadharNumber);

        const sqlGetPicture = `select picture_name, link from citizens where aadhar_number = ?`

        db.query(sqlGetPicture, [aadharNumber], (error, results) => {
          if (error) {
            console.log(
              'error finding imgs ', error
            );
          }

          if (results.length > 0) {
            console.log('found pfp img', results);
            res.json(results)
          }
        })

      } else {
        res.status(404).send('User not found.');
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getProfilePicture
}