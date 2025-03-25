const db = require('../../models/database')
const database = require('../../models/pool')
const nodemailer = require('nodemailer');
require('dotenv').config();
const { logChange, clearLogs, getLogs } = require('./adminLogs')





const updateDepartmentName = (req, res) => {

  try {
    const { id, value, oldValue } = req.body
    console.log('id, value: ', id, value);

    const checkDepExists = `select * from department_coordinators where department_name = ?`

    db.query(checkDepExists, [value], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }

      if (results.length > 0) {
        console.log('department name already exists');
        res.send({ status: false, message: 'Department names already exists, try another name...' })
      } else {
        //update dep name 
        const updateDepName = `update department_coordinators set department_name = ? where department_id = ?`


        db.query(updateDepName, [value, id], (error, results) => {
          if (error) {
            console.log(error);
            res.send({ status: false, message: 'Something went wrong, please try again later...' })
          }

          if (results.affectedRows > 0) {

            console.log('updated name successfully');
            logChange('DepNameUpdate', 'Dep name update', id, oldValue, value)
            res.send({ status: true, message: 'Updated department name successfully...' })
          } else {
            console.log('could not update dep name ');
            res.send({ status: false, message: 'Could not update department name, please try again later...' })
          }
        })
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: 'Something went wrong, try again later...' })
  }

}


const updateDepCoordName = (req, res) => {
  try {
    const { id, value, oldValue } = req.body;
    console.log('id, value:', id, value);


    const checkDepExists = 'SELECT dep_coordinator_id FROM department_coordinators WHERE department_id = ?';

    db.query(checkDepExists, [id], (error, results) => {
      if (error) {
        console.error('Error checking department:', error);
        return res.send({ status: false, message: 'Something went wrong, please try again later...' });
      }

      if (results.length === 0) {
        console.log('Department not found');
        return res.send({ status: false, message: 'Department not found...' });
      }

      const depCoordinatorId = results[0].dep_coordinator_id;


      const updateNameQuery = 'UPDATE users SET full_name = ? WHERE email = ?';

      db.query(updateNameQuery, [value, depCoordinatorId], (error, results) => {
        if (error) {
          console.error('Error updating name:', error);
          return res.send({ status: false, message: 'Something went wrong, please try again later...' });
        }

        if (results.affectedRows > 0) {
          console.log('Updated name successfully');
          logChange('DepCoordNameUpdate', 'Dep coordinator name update', depCoordinatorId, oldValue, value)
          const logs = getLogs()
          console.log(logs);
          return res.send({ status: true, message: 'Updated department coordinator name successfully...' });
        } else {
          console.log('Could not update name');
          return res.send({ status: false, message: 'Could not update name, please try again later...' });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Something went wrong, try again later...' });
  }
};
const updateDepCoordEmail = (req, res) => {
  const { id, newEmail, oldValue } = req.body;

  if (!newEmail) {
    return res.send({ status: false, message: 'New email cannot be empty...' });
  }

  database.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
      return res.send({ status: false, message: 'Something went wrong, please try again later...' });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error('Transaction error:', err);
        return res.send({ status: false, message: 'Something went wrong, please try again later...' });
      }


      connection.query(`SELECT email FROM users WHERE email = ?`, [newEmail], (err, results) => {
        if (err) {
          connection.rollback(() => connection.release());
          console.error('Error checking email existence:', err);
          return res.send({ status: false, message: 'Something went wrong, please try again later...' });
        }

        if (results.length > 0) {
          connection.rollback(() => connection.release());
          return res.send({ status: false, message: 'This email is already in use. Please use a different email.' });
        }


        connection.query(`SELECT dep_coordinator_id FROM department_coordinators WHERE department_id = ?`, [id], (err, results) => {
          if (err) {
            connection.rollback(() => connection.release());
            console.error('Error fetching department:', err);
            return res.send({ status: false, message: 'Something went wrong, please try again later...' });
          }

          if (results.length === 0) {
            connection.rollback(() => connection.release());
            return res.send({ status: false, message: 'Department not found...' });
          }

          const oldEmail = results[0].dep_coordinator_id;
          console.log('oldEmail: ', oldEmail);


          connection.query(`SELECT user_password FROM users WHERE email = ?`, [oldEmail], (err, results) => {
            if (err) {
              connection.rollback(() => connection.release());
              console.error('Error fetching user password:', err);
              return res.send({ status: false, message: 'Something went wrong, please try again later...' });
            }

            if (results.length === 0) {
              connection.rollback(() => connection.release());
              return res.send({ status: false, message: 'User not found with this email...' });
            }

            const password = results[0].user_password;
            console.log('password: ', password);

            connection.query(`SET FOREIGN_KEY_CHECKS=0`, (err) => {
              if (err) {
                connection.rollback(() => connection.release());
                console.error('Error disabling foreign key checks:', err);
                return res.send({ status: false, message: 'Something went wrong, please try again later...' });
              }


              connection.query(`UPDATE users SET email = ? WHERE email = ?`, [newEmail, oldEmail], (err, results) => {
                if (err) {
                  connection.rollback(() => connection.release());
                  console.error('Error updating users:', err.sqlMessage);
                  return res.send({ status: false, message: `Something went wrong, please try again later... (${err.sqlMessage})` });
                }


                connection.query(`UPDATE department_coordinators SET dep_coordinator_id = ? WHERE department_id = ?`, [newEmail, id], (err, results) => {
                  if (err) {
                    connection.rollback(() => connection.release());
                    console.error('Error updating department_coordinators:', err);
                    return res.send({ status: false, message: 'Something went wrong, please try again later...' });
                  }


                  connection.query(`SET FOREIGN_KEY_CHECKS=1`, (err) => {
                    if (err) {
                      connection.rollback(() => connection.release());
                      console.error('Error enabling foreign key checks:', err);
                      return res.send({ status: false, message: 'Something went wrong, please try again later...' });
                    }


                    connection.commit((err) => {
                      if (err) {
                        connection.rollback(() => connection.release());
                        console.error('Transaction commit error:', err);
                        return res.send({ status: false, message: 'Something went wrong, please try again later...' });
                      }

                      connection.release();


                      sendEmail(newEmail, password)
                        .then(() => {
                          logChange('DepCoordEmailUpdate', 'Dep coordinator email update', id, oldEmail, newEmail)
                          res.send({ status: true, message: 'Updated department coordinator email successfully and email sent!' });
                        })
                        .catch((err) => {
                          console.error('Error sending email:', err);
                          res.send({ status: false, message: 'Email update successful, but failed to send email notification.' });
                        });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};


const sendEmail = async (toEmail, password) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your Account Credentials - SpotFix',
    text: `Hello,\n\nYour account email has been successfully updated.\n\nLogin Details:\nEmail: ${toEmail}\nPassword: ${password}\n\nFor security reasons, we recommend changing your password immediately.\n\nBest regards,\nSpotFix Team`,
  };

  await transporter.sendMail(mailOptions);
};



const getDepNameLogs = (req, res) => {

  console.log('getting for dep name logs');
  const logs = getLogs('DepNameUpdate')
  console.log('logs: ', logs);
  try {

    if (logs) {
      res.send({ status: true, logs })
    }

  } catch (error) {
    console.log(error);
    res.send({ status: false })
  }
}

const getDepCoordNameLogs = (req, res) => {

  console.log('getting for dep name logs');
  const logs = getLogs('DepCoordNameUpdate')
  console.log('logs: ', logs);
  try {

    if (logs) {
      res.send({ status: true, logs })
    }

  } catch (error) {
    console.log(error);
    res.send({ status: false })
  }
}
const getDepCoordEmailLogs = (req, res) => {

  console.log('getting for dep name logs');
  const logs = getLogs('DepCoordEmailUpdate')
  console.log('logs: ', logs);
  try {

    if (logs) {
      res.send({ status: true, logs })
    }

  } catch (error) {
    console.log(error);
    res.send({ status: false })
  }
}



module.exports = {
  updateDepartmentName, updateDepCoordName, updateDepCoordEmail, getDepNameLogs, getDepCoordNameLogs, getDepCoordEmailLogs
}