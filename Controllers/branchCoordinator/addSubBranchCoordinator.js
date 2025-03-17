const db = require('../../models/database');
const nodemailer = require('nodemailer');

const sendAccountCreationEmail = (email, name, password) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS,
    },
  });


  const mailOptions = {
    from: '"SpotFix Team" <your-email@gmail.com>',
    to: email,
    subject: 'Your SpotFix Account is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007bff;">Welcome to SpotFix, ${name}!</h2>
        <p>Your account has been created as a <strong>Sub-Branch Coordinator</strong>.</p>
        <p><strong>Login Details:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>Please login and change your password after the first login.</p>

        <p style="margin-top: 20px; font-size: 12px; color: #888;">If you did not request this, please contact our support team.</p>
      </div>
    `,
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending account creation email:', error);
    } else {
      console.log('Account creation email sent:', info.response);
    }
  });
};



const addSubBranchCoordinator = (req, res) => {
  try {
    const { name, departmentName, email, phoneNumber, latitude, longitude, password, pincodes } = req.body;
    console.log(name, departmentName, email, phoneNumber, latitude, longitude, password, pincodes);

    const pincodeArray = pincodes.split(',').map(pincode => pincode.trim());

    // Check if user exists
    const sqlCheckUser = `SELECT * FROM users WHERE email = ?`;
    db.query(sqlCheckUser, [email], (error, results) => {
      if (error) {
        console.error('Error checking user existence:', error);
        return res.send({ status: false, message: 'Database error while checking user existence' });
      }

      if (results.length === 0) {
        console.log('User does not exist, proceeding with adding sub-department coordinator');

        // Add user
        const sqlAddUser = `INSERT INTO users (email, full_name, user_password, phone_number, user_type) VALUES (?, ?, ?, ?, 'sub_branch_coordinator')`;
        db.query(sqlAddUser, [email, name, password, phoneNumber], (error, results) => {
          if (error) {
            console.error('Error adding user:', error);
            return res.send({ status: false, message: 'Database error while adding user' });
          }

          if (!results || results.affectedRows === 0) {
            return res.send({ status: false, message: 'Failed to add user' });
          }

          console.log('User added successfully:', results);

          // Add sub-branch coordinator entry
          const sqlAddSubBranchCoordinator = `INSERT INTO sub_department_coordinators (sub_department_coordinator_id, department_id, latitude, longitude) VALUES (?, ?, ?, ?)`;
          db.query(sqlAddSubBranchCoordinator, [email, departmentName, latitude, longitude], (error, results) => {
            if (error) {
              console.error('Error adding sub-branch coordinator:', error);
              return res.send({ status: false, message: 'Database error while adding sub-branch coordinator' });
            }

            if (!results || results.affectedRows === 0) {
              return res.send({ status: false, message: 'Failed to add sub-branch coordinator' });
            }

            console.log('Sub-branch coordinator added successfully:', results);

            // Map coordinator to multiple pincodes
            const sqlMapCoordinatorPincodes = `INSERT INTO sub_dep_coordinator_pincodes (sub_department_coordinator_id, pincode) VALUES ?`;
            const coordinatorPincodeValues = pincodeArray.map(pincode => [email, pincode]);

            db.query(sqlMapCoordinatorPincodes, [coordinatorPincodeValues], (error, results) => {
              if (error) {
                console.error('Error mapping pincodes to coordinator:', error);
                return res.send({ status: false, message: 'Database error while mapping pincodes to coordinator' });
              }

              console.log('Coordinator mapped to pincodes successfully:', results);
              sendAccountCreationEmail(email, name, password);
              return res.send({ status: true, message: 'Sub-branch coordinator added successfully' });
            });
          });
        });

      } else {
        console.log('User already exists');
        return res.send({ status: false, message: 'User already exists. Please enter different details.' });
      }
    });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return res.send({ status: false, message: 'Internal server error' });
  }
};



module.exports = {
  addSubBranchCoordinator
};
