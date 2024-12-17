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
          } else {
            console.log('User account can be created');

            const sql = `
            INSERT INTO users 
              (email, full_name,user_password, phone_number, user_type) 
            VALUES 
              (?, ?, ?, ?, ?)
          `;

            db.query(sql, [details.email, details.name, details.password, details.phoneNumber, 'citizen'], (error, results) => {
              if (error) {
                console.log('Error creating user account:', error);

              }

              if (results.affectedRows > 0) {
                const sqlCheckPincode = "SELECT COUNT(*) AS count FROM citizen_pincode WHERE pincode = ?";
                db.query(sqlCheckPincode, [details.pincode], (err, result) => {
                  if (err) {
                    console.log('Error checking pincode existence: ', err);

                  }

                  if (result[0].count === 0) {
                    const sqlInsertPincode = "INSERT INTO citizen_pincode (pincode, city, state) VALUES (?, ?, ?)";
                    db.query(sqlInsertPincode, [details.pincode, details.city, details.state], (insertErr, insertResult) => {
                      if (insertErr) {
                        console.log('Error adding pincode to citizen_pincode table: ', insertErr);

                      }

                      if (insertResult.affectedRows > 0) {
                        console.log('Pincode added to citizen_pincode table');
                        const sqlInsertCitizen = "INSERT INTO citizens (aadhar_number, status, locality, pincode) VALUES (?, ?, ?, ?)";
                        db.query(sqlInsertCitizen, [details.aadharCardNumber, 'approved', details.locality, details.pincode], (insertErr, insertResult) => {
                          if (insertErr) {
                            console.log('Error adding citizen: ', insertErr);
                            return false;
                          }

                          if (insertResult.affectedRows > 0) {
                            console.log('User successfully created in citizens table');
                            const sqlInsertAadharNumber = `INSERT INTO citizen_aadhar_number values (?, ?)`

                            db.query(sqlInsertAadharNumber, [details.email, details.aadharCardNumber], (error, results) => {
                              if (error) {
                                console.log('error adding aadhar card number in citizen_aadhar_number table : ', error);
                              }
                              if (results.affectedRows > 0) {
                                console.log('Citizen aadhar card number added in citizen_aadhar_number table');
                              } else {
                                console.log('failed to add aadhar card number in citizen_aadhar_number table ');
                              }
                            })

                          } else {
                            console.log('Failed to create user in citizens table');
                            return false;
                          }
                        });
                      } else {
                        console.log('Failed to add pincode to citizen_pincode table');

                      }
                    });
                  } else {

                    console.log('Pincode already exists, proceeding with citizen insertion');


                    const sqlInsertCitizen = "INSERT INTO citizens (aadhar_number, status, latitude, longitude, locality, pincode) VALUES (?, ?, ?, ?)";
                    db.query(sqlInsertCitizen, [details.aadharCardNumber, 'approved', details.locality, details.pincode], (insertErr, insertResult) => {
                      if (insertErr) {
                        console.log('Error adding citizen: ', insertErr);
                        return false;
                      }

                      if (insertResult.affectedRows > 0) {
                        console.log('User successfully created in citizens table');

                        const sqlInsertAadharNumber = `INSERT INTO citizen_aadhar_number values (?, ?)`

                        db.query(sqlInsertAadharNumber, [details.email, details.aadharCardNumber], (error, results) => {
                          if (error) {
                            console.log('error adding aadhar card number in citizen_aadhar_number table : ', error);
                          }
                          if (results.affectedRows > 0) {
                            console.log('Citizen aadhar card number added in citizen_aadhar_number table');
                          } else {
                            console.log('failed to add aadhar card number in citizen_aadhar_number table ');
                          }
                        })
                        res.json({ message: 'User Account Created ', creationStatus: true })
                      } else {
                        console.log('Failed to create user in citizens table');
                        return false;
                      }
                    });
                  }
                });

                return true;
              } else {
                console.log('Failed to create user account');
                return false;
              }
            });

            return res.json(userData);
          }
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
