const db = require('../../models/database');
const aadhardb = require('../../models/aadharDatabase');
require('dotenv').config()
const verifyUserSignup = (req, res) => {
  try {
    const details = req.body;
    console.log(details);

    const sql = 'SELECT * FROM users WHERE full_name = ? AND state = ? AND aadhaar_number = ? AND phone_number = ?';
    aadhardb.execute(sql, [details.name, process.env.STATE, details.aadharCardNumber, details.phoneNumber], (error, results) => {
      if (error) {
        console.error('Error verifying Aadhar details:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      const userData = {
        aadharVerification: false,
        userExists: false,
      };

      if (results.length > 0) {
        console.log('Aadhar details verified');
        userData.aadharVerification = true;

        const sql2 = 'SELECT u.email, u.phone_number, c.aadhar_number FROM users u JOIN citizens c ON u.email = ? AND u.phone_number = ? AND c.aadhar_number = ?';
        db.execute(sql2, [details.email, details.phoneNumber, details.aadharCardNumber], (error2, results2) => {
          if (error2) {
            console.error('Error checking if user exists:', error2);
            return res.status(500).json({ message: 'Internal server error' });
          }

          if (results2.length > 0) {
            console.log('User exists');
            userData.userExists = true;
            return res.json(userData);
          }

          console.log('User account can be created');
          const sql = `
            INSERT INTO users 
              (email, full_name, user_password, phone_number, user_type) 
            VALUES 
              (?, ?, ?, ?, ?)
          `;
          db.query(sql, [details.email, details.name, details.password, details.phoneNumber, 'citizen'], (error, results) => {
            if (error) {
              console.log('Error creating user account:', error);
              return res.status(500).json({ message: 'Error creating user account' });
            }

            if (results.affectedRows > 0) {

              const sqlCheckPincode = "SELECT COUNT(*) AS count FROM citizen_pincode WHERE pincode = ?";
              db.query(sqlCheckPincode, [details.pincode], (err, result) => {
                if (err) {
                  console.log('Error checking pincode existence: ', err);
                  return res.status(500).json({ message: 'Error checking pincode existence' });
                }

                if (result[0].count === 0) {
                  const sqlInsertPincode = "INSERT INTO citizen_pincode (pincode, city, state) VALUES (?, ?, ?)";
                  db.query(sqlInsertPincode, [details.pincode, details.city, details.state], (insertErr, insertResult) => {
                    if (insertErr) {
                      console.log('Error adding pincode to citizen_pincode table: ', insertErr);
                      return res.status(500).json({ message: 'Error adding pincode' });
                    }

                    insertCitizen(details, res);
                  });
                } else {
                  console.log('Pincode already exists, proceeding with citizen insertion');
                  insertCitizen(details, res);
                }
              });
            } else {
              console.log('Failed to create user account');
              return res.status(500).json({ message: 'Failed to create user account' });
            }
          });
        });
      } else {
        console.log('Aadhar details verification failed');
        return res.json({ message: 'Aadhar Card Details Verification Failed', verificationStatus: false });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const insertCitizen = (details, res) => {
  const sqlInsertCitizen = "INSERT INTO citizens (aadhar_number, status, locality, pincode) VALUES (?, ?, ?, ?)";
  db.query(sqlInsertCitizen, [details.aadharCardNumber, 'approved', details.locality, details.pincode], (insertErr, insertResult) => {
    if (insertErr) {
      console.log('Error adding citizen: ', insertErr);
      return res.status(500).json({ message: 'Error adding citizen' });
    }

    if (insertResult.affectedRows > 0) {
      console.log('User successfully created in citizens table');
      const sqlInsertCitizenAadhar = `
      INSERT INTO citizen_aadhar_number (citizen_id, aadhar_number) 
      VALUES (?, ?)
    `;
      db.query(sqlInsertCitizenAadhar, [details.email, details.aadharCardNumber], (aadharErr, aadharResult) => {
        if (aadharErr) {
          console.error('Error adding Aadhar number to citizen_aadhar_number table:', aadharErr);
          return res.status(500).json({ message: 'Error linking citizen with Aadhar' });
        }

        if (aadharResult.affectedRows > 0) {
          console.log('Citizen linked with Aadhar successfully');
          return res.json({ message: 'User account created and linked', creationStatus: true, aadharVerification : true });
        } else {
          console.log('Failed to link citizen with Aadhar');
          return res.status(500).json({ message: 'Failed to link citizen with Aadhar' });
        }
      });

    } else {
      console.log('Failed to create user in citizens table');
      return res.status(500).json({ message: 'Failed to create user in citizens table' });
    }
  });
};

const getAadharDetails = (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const sqlGetAadharDetails = `select * from users where phone_number = ?`

    aadhardb.query(sqlGetAadharDetails, [phoneNumber], (error, results) => {
      if (error) {
        console.log('error fetching aadhar details : ', error);
      }

      if (results.length > 0) {
        res.json({ results, userExists: true })
      } else {
        console.log('nope');
        res.json({ message: 'aadhar number does not exist', userExists: false })
      }
    })
  } catch (error) {
    console.log('error fetching aadhar details : ', error);
  }
}

module.exports = {
  verifyUserSignup,
  getAadharDetails
};
