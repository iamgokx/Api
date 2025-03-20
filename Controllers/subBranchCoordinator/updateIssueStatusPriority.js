const db = require('../../models/database')

const updateIssue = (req, res) => {
  try {
    const { issueId, status, priority } = req.body;
    console.log("issueId, status, priority: ", issueId, status, priority);


    const checkSql = `SELECT issue_status FROM issues WHERE issue_id = ?`;

    db.query(checkSql, [issueId], (err, results) => {
      if (err) {
        console.log("Error checking issue status:", err);
        return res.status(500).send({ status: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).send({ status: false, message: "Issue not found" });
      }

      const currentStatus = results[0].issue_status;


      if (currentStatus === "completed") {
        return res.status(400).send({ status: false, message: "Cannot update issue because it is already completed" });
      }


      const updateSql = `UPDATE issues SET priority = ?, issue_status = ? WHERE issue_id = ?`;

      db.query(updateSql, [priority, status, issueId], (error, updateResults) => {
        if (error) {
          console.log("Error updating issue:", error);
          return res.status(500).send({ status: false, message: "Database update error" });
        }

        if (updateResults.affectedRows > 0) {
          console.log("Updated status successfully");
          res.send({ status: true, message: "Updated issue successfully" });
        } else {
          res.status(400).send({ status: false, message: "No changes made" });
        }
      });
    });
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).send({ message: "Something went wrong, please try again later" });
  }
};

const setEstimateCompleteTime = (req, res) => {


  const { issueid, date } = req.body
  console.log('issueId and date  ', issueid, date);

  try {

    const sql = `update issues set estimate_complete_time = ? where issue_id = ?`

    db.query(sql, [date, issueid], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again..' })
      }

      if (results.affectedRows > 0) {
        res.send({ status: true, message: 'Successfully updated estimate completion time...' })
      } else {
        console.log('could not update estimate completion time');
        res.send({ status: false, message: 'Something went wrong, please try again..' })
      }
    })

  } catch (error) {
    console.log('error : ', error);
    res.send({ status: false, message: 'Something went wrong, please try again..' })
  }

}


const updateDepartmentId = (req, res) => {
  console.log('getting req');
  try {
    const { issue_id, depId } = req.body
    console.log('issue_id, depId: ', issue_id, depId);

    const sqlUpdateDepId = `update issues set department_id = ? where issue_id = ? `

    db.query(sqlUpdateDepId, [depId, issue_id], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'something went wrong please try again later..' })
      }

      if (results.affectedRows > 0) {
        console.log('updated departmetn id successfully');
        res.send({ status: true, message: 'updated department id successfully' })
      } else {
        console.log('could not update department id');
        res.send({ status: false, message: 'could not update department id' })
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: 'something went wrong please try again later..' })
  }
}


module.exports = {
  updateIssue, setEstimateCompleteTime, updateDepartmentId
}