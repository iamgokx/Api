const db = require('../../models/database')

const nodemailer = require('nodemailer');
const { sendNotification } = require('../../socketData/manageSocket')
const { logChange, getLogs } = require('./branchCoordinatorLogs')
const mysql = require('mysql2')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});




const updateSubDepCoordName = (req, res) => {
  console.log('getting for updating name');

  try {
    const { newName, email, senderEmail, oldValue } = req.body
    console.log(' newName, email : ', newName, email);

    const sql = `update users set full_name = ? where email = ?`

    db.query(sql, [newName, email], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'something went wrong, please try again later.....' })
      }

      if (results.affectedRows > 0) {
        console.log('sub branch coord name updated');
        logChange('subDepName', 'Updated sub dep coordinator name', email, oldValue, newName)

        res.send({ status: true, message: 'Updated sub branch coordinators name successfully...' })
      } else {
        console.log('could not update sub branch coord name');
        res.send({ status: false, message: 'Could not update sub branch coord name, please try again later...' })
      }
    })
  } catch (error) {
    console.log(error)
    res.send({ status: false, message: 'something went wrong, please try again later.....' })
  }
}

const updateSubDepCoordPincodes = (req, res) => {
  console.log('getting for updating pincodes');
  try {
    const { newPincodes, email, oldValue } = req.body

    const pincodeArray = newPincodes.split(',').map((pincode) => pincode.trim())


    db.query(
      "DELETE FROM sub_dep_coordinator_pincodes WHERE sub_department_coordinator_id = ?",
      [email],
      (err) => {
        if (err) {
          console.error("Error deleting pincodes:", err);
          return db.query("ROLLBACK", () => {
            res.send({ status: false, message: "Error deleting pincodes" });
          });
        }


        if (pincodeArray.length > 0) {
          const values = pincodeArray.map((pincode) => [email, pincode]);

          db.query(
            "INSERT INTO sub_dep_coordinator_pincodes (sub_department_coordinator_id, pincode) VALUES ?",
            [values],
            (err) => {
              if (err) {
                console.error("Error inserting pincodes:", err);
                return db.query("ROLLBACK", () => {
                  res.send({ status: false, message: "Error inserting pincodes" });
                });
              }


              db.query("COMMIT", (err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  return res.send({ status: false, message: "Transaction commit error" });
                }

                logChange('subDepCoordPincodes', 'Updated sub dep coordinator pincodes', email, oldValue, newPincodes)
                res.send({ status: true, message: "Pincodes updated successfully" });
              });
            }
          );
        } else {

          db.query("COMMIT", (err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return res.send({ status: false, message: "Transaction commit error" });
            }
            res.send({ status: true, message: "Pincodes updated successfully" });
          });
        }
      }
    );



  } catch (error) {
    console.log(error)
    res.send({ status: false, message: 'something went wrong, please try again later.....' })
  }
}



const updateSubDepCoordId = async (req, res) => {
  console.log("Getting for updating sub-dep coordinator ID");

  const { oldEmail, newEmail } = req.body;
  console.log("oldEmail, newEmail: ", oldEmail, newEmail);

  if (!oldEmail || !newEmail) {
    return res.send({ status: false, message: "Missing fields" });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS,
    },
  });

  const connection = await pool.promise().getConnection();

  try {
    await connection.beginTransaction();


    const [existingEmail] = await connection.query(
      "SELECT email FROM users WHERE email = ?",
      [newEmail]
    );

    if (existingEmail.length > 0) {
      console.log("Email already exists");
      res.send({ status: false, message: "Email is already in use, please enter a new email..." });
      connection.release();
      return;
    }


    const [userData] = await connection.query(
      "SELECT user_password FROM users WHERE email = ?",
      [oldEmail]
    );

    if (userData.length === 0) {
      throw new Error("User not found");
    }

    const userPassword = userData[0].user_password;
    console.log('userPassword: ', userPassword);


    await connection.query("SET FOREIGN_KEY_CHECKS = 0");


    const [userResult] = await connection.query(
      "UPDATE users SET email = ? WHERE email = ?",
      [newEmail, oldEmail]
    );

    if (userResult.affectedRows === 0) {
      throw new Error("User email not found");
    }


    await connection.query(
      "UPDATE sub_department_coordinators SET sub_department_coordinator_id = ? WHERE sub_department_coordinator_id = ?",
      [newEmail, oldEmail]
    );


    await connection.query(
      "UPDATE sub_dep_coordinator_pincodes SET sub_department_coordinator_id = ? WHERE sub_department_coordinator_id = ?",
      [newEmail, oldEmail]
    );


    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    await connection.commit();


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: 'Your Account Credentials - SpotFix',
      text: `Dear User,

Your account email has been successfully updated.

 New Login Details:
    Email: ${newEmail}
    Password: ${userPassword} (Please change it after logging in)

For security reasons, we recommend changing your password after logging in.

Thank you,
The SpotFix Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    logChange('subDepId', 'Updated sub dep coordinator name', newEmail, oldEmail, newEmail)

    res.json({ status: true, message: "Email updated successfully, notification sent" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating email:", error);

    if (error.message === "Email is already in use") {
      return res.status(400).json({ status: false, message: error.message });
    }

    res.status(500).json({ status: false, message: "Error updating email" });
  } finally {
    connection.release();
  }
};







const getSubDepCoordNameLogs = (req, res) => {

  console.log('getting for dep name logs');
  const logs = getLogs('subDepName')
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

const getSubDepPincodesLogs = (req, res) => {

  console.log('getting for dep name logs');
  const logs = getLogs('subDepCoordPincodes')
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
const getSubDepCoordEmailLogs = (req, res) => {

  console.log('getting for dep name logs');
  const logs = getLogs('subDepId')
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
  updateSubDepCoordId, updateSubDepCoordName, updateSubDepCoordPincodes, getSubDepCoordNameLogs, getSubDepPincodesLogs, getSubDepCoordEmailLogs
}


