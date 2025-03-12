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
    const { name, departmentName, email, phoneNumber, latitude, longitude, password } = req.body;
    console.log(name, departmentName, email, phoneNumber, latitude, longitude, password);

    // Check if user exists
    const sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.error('Error finding if user exists:', error);
        return res.json({ status: false, message: 'Database error while checking user existence' });
      }

      if (results.length === 0) {
        console.log('User does not exist, proceeding with adding sub-department coordinator');

        // Add user
        const sqlAddUser = `INSERT INTO users (email, full_name, user_password, phone_number, user_type) VALUES (?, ?, ?, ?, 'sub_branch_coordinator')`;

        db.query(sqlAddUser, [email, name, password, phoneNumber], (error, results) => {
          if (error) {
            console.error('Error adding user for sub-branch coordinator:', error);
            return res.json({ status: false, message: 'Database error while adding user' });
          }

          if (!results || results.affectedRows === 0) {
            console.log('User insertion query ran but did not insert any rows.');
            return res.json({ status: false, message: 'Failed to add user' });
          }

          console.log('User added successfully:', results);

          // Add sub-branch coordinator entry
          const sqlAddSubBranchCoordinator = `INSERT INTO sub_department_coordinators (sub_department_coordinator_id, department_id, latitude, longitude) VALUES (?, ?, ?, ?)`;

          db.query(sqlAddSubBranchCoordinator, [email, departmentName, latitude, longitude], (error, results) => {
            if (error) {
              console.error('Error adding sub-branch coordinator:', error);
              return res.json({ status: false, message: 'Database error while adding sub-branch coordinator' });
            }

            if (!results || results.affectedRows === 0) {
              console.log('Sub-branch coordinator insertion query ran but did not insert any rows.');
              return res.json({ status: false, message: 'Failed to add sub-branch coordinator' });
            }

            console.log('Sub-branch coordinator added successfully:', results);
            sendAccountCreationEmail(email, name, password);
            return res.json({ status: true, message: 'Sub-branch coordinator added successfully' });
          });
        });

      } else {
        console.log('User exists, please enter valid details');
        return res.json({ status: false, message: 'User already exists. Please enter different details.' });
      }
    });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return res.json({ status: false, message: 'Internal server error' });
  }
};

module.exports = {
  addSubBranchCoordinator
};
