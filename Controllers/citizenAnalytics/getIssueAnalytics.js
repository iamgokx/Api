const db = require('../../models/database')

const getIssueAnalytics = (req, res) => {
  try {
    const sql = ` select issue_id,issue_status,date_time_created, priority, department_id, is_anonymous from issues;`

    db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no issue found');
        res.send({ status: false })
      }
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getIssueAnalytics
}