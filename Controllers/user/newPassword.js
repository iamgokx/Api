const db = require("../../models/database");

const setNewUserPassword = (req, res) => {
  console.log("Setting new password...");
  const { password, user } = req.body;
  console.log("New password for user:", user);

  try {
   
    const checkSql = `SELECT user_password FROM users WHERE email = ?`;

    db.query(checkSql, [user], (err, results) => {
      if (err) {
        console.log("Error checking current password:", err);
        return res.send({ status: false, message: "Server error" });
      }

      if (results.length === 0) {
        console.log("User not found");
        return res.send({ status: false, message: "User not found" });
      }

      const currentPassword = results[0].user_password;

      
      if (currentPassword === password) {
        console.log("New password is the same as the old password.");
        return res.send({ status: false, message: "New password must be different from the current password." });
      }

      
      const updateSql = `UPDATE users SET user_password = ? WHERE email = ?`;

      db.query(updateSql, [password, user], (error, updateResults) => {
        if (error) {
          console.log("Error changing password:", error);
          return res.send({ status: false, message: "Error updating password" });
        }

        if (updateResults.affectedRows > 0) {
          console.log("Password changed successfully.");
          res.send({ status: true, message: "Password updated successfully" });
        } else {
          console.log("Could not change password.");
          res.send({ status: false, message: "Could not update password" });
        }
      });
    });
  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).send({ status: false, message: "Server error" });
  }
};

module.exports = {
  setNewUserPassword,
};
