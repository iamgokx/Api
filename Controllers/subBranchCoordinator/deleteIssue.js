const db = require("../../models/database");
const nodemailer = require("nodemailer");

const sendAccountCreationEmail = (email, title, reason) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: '"SpotFix Team" <your-email@gmail.com>',
    to: email,
    subject: "Your issue has been rejected/deleted",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007bff;">Title: ${title}</h2>
        <p>The issue you reported has been <strong>rejected/deleted</strong> by the sub-department coordinator.</p>
        <p><strong>Reason for Rejection/Deletion:</strong> ${reason}</p>
        <p>Thank you for your understanding and cooperation.</p>
        <p>Team SpotFix</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const deleteIssue = (req, res) => {
  try {
    const { issue_id, citizen_aadhar, reason, title } = req.body;
    console.log("Deleting issue:", { issue_id, citizen_aadhar, reason, title });

    const sqlGetEmail = "SELECT citizen_id FROM citizen_aadhar_number WHERE aadhar_number = ?";
    const sqlDeleteIssueMedia = "DELETE FROM issues_media WHERE issue_id = ?";
    const sqlDeleteIssueSuggestions = "DELETE FROM issues_suggestions WHERE issue_id = ?";
    const sqlDeleteIssue = "DELETE FROM issues WHERE issue_id = ?";


    db.query(sqlGetEmail, [citizen_aadhar], (error, results) => {
      if (error) {
        console.error("Error fetching citizen email:", error);
        return res.send({ status: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res.send({ status: false, message: "Citizen not found" });
      }

      const email = results[0].citizen_id;
      console.log("Found email:", email);


      db.query(sqlDeleteIssueMedia, [issue_id], (error) => {
        if (error) console.error("Error deleting media:", error);


        db.query(sqlDeleteIssueSuggestions, [issue_id], (error) => {
          if (error) console.error("Error deleting suggestions:", error);


          db.query(sqlDeleteIssue, [issue_id], (error, result) => {
            if (error) {
              console.error("Error deleting issue:", error);
              return res.send({ status: false, message: "Error deleting issue" });
            }

            if (result.affectedRows > 0) {
              console.log("Deleted issue successfully");

              sendAccountCreationEmail(email, title, reason);

              return res.send({ status: true, message: "Issue deleted successfully" });
            } else {
              return res.send({ status: false, message: "Issue not found" });
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.send({ status: false, message: "Internal server error" });
  }
};

module.exports = { deleteIssue };
