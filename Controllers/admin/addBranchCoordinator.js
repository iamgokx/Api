const db = require('../../models/database')
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
        <p>Your account has been created as a <strong>Branch Coordinator</strong>.</p>
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




const addBranchCoordinator = (req, res) => {
  const { name, email, password, phoneNumber, departmentName, state } = req.body
  console.log('name , email, password,phoneNumber,departmentName,state: ', name, email, password, phoneNumber, departmentName, state);
  try {
    //check if the email is already used 

    const sql = `select * from users where email = ?`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        //user email already used
        console.log('email is already used')
        res.send({ status: false, message: 'Email already used, please enter a new email address' })
      } else {
        //add user
        const sqladduser = `insert into users values (?,?,?,?,'department_coordinator')`

        db.query(sqladduser, [email, name, password, phoneNumber], (error, results) => {
          if (error) {
            console.log(error);
          }

          if (!results) {
            console.log(
              'Error: unable to add user to database '
            );
            res.send({ status: false, message: 'unable to add user to database, please try again (Internal Server Error)' })
          }

          if (results.affectedRows > 0) {
            console.log('added new branch coordinator');
            console.log(results);

            const addDepCoordinator = `insert into department_coordinators (dep_coordinator_id, department_name,state) values (?,?,?)`
            db.query(addDepCoordinator, [email, departmentName, state], (error, results) => {
              if (error) {
                console.log(error);
              }

              if (!results) {
                console.log(
                  'Error: unable to add dep coordinator to database '
                );
                res.send({ status: false, message: 'unable to add Department coordinator to database, please try again (Internal Server Error)' })
              }

              if (results.affectedRows > 0) {
                console.log('added new department coordinator');
                sendAccountCreationEmail(email, name, password);
                res.send({ status: true, message: 'Department Coordinator added successfully' })
              }
            })

          }
        })
      }
    })

  } catch (error) {
    console.log(error);
  }

}

module.exports = {
  addBranchCoordinator
}