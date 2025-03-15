const db = require('../../models/database');

const getReportsChartData = (req, res) => {
  console.log('gettign for reports chart data');
  const { email } = req.body;
  try {
    const query = `
      SELECT DATE_FORMAT(r.date_time_created, '%b %Y') AS month_year, 
             COUNT(*) AS report_count
      FROM reports r
      JOIN sub_department_coordinators sdc 
        ON r.sub_branch_coordinator_id = sdc.sub_department_coordinator_id
      JOIN department_coordinators dc 
        ON sdc.department_id = dc.department_id
      WHERE dc.dep_coordinator_id = ?
      GROUP BY month_year
      ORDER BY STR_TO_DATE(month_year, '%b %Y');
    `;

    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error fetching report data:", err);
        res.send({ error: "Database error" });
        return;
      }
      res.send({ status: true, results });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.send({ message: "Internal server error" });
  }
};


const getIssuePriorityChartData = (req, res) => {
  console.log('gettign for priority chart ');
  const { email } = req.body;
  try {
    const query = `
      SELECT i.priority AS category, 
             COUNT(i.issue_id) AS value
      FROM issues i
      JOIN department_coordinators d 
        ON i.department_id = d.department_id
      WHERE d.dep_coordinator_id = ?
      GROUP BY i.priority;
    `;

    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error fetching issue priority data:", err);
        res.send({ error: "Database error" });
        return;
      }
      res.send({ status: true, results });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.send({ message: "Internal server error" });
  }
};


const getIssueStatusChartData = (req, res) => {
  console.log('gettign for issue status chart');
  const { email } = req.body;
  try {
    const query = `
      SELECT i.issue_status AS category, 
             COUNT(i.issue_id) AS value
      FROM issues i
      JOIN department_coordinators d 
        ON i.department_id = d.department_id
      WHERE d.dep_coordinator_id = ?
      GROUP BY i.issue_status;
    `;

    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error fetching issue status data:", err);
        res.send({ error: "Database error" });
        return;
      }
      res.send({ status: true, results });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.send({ message: "Internal server error" });
  }
};


const getCompletionChartData = (req, res) => {
  console.log('gettign for completion chart');
  const { email } = req.body;
  try {
    const query = `
      SELECT 'Completed %' AS category,
             (COUNT(CASE WHEN i.issue_status = 'completed' THEN 1 END) / COUNT(i.issue_id)) * 100 AS value
      FROM issues i
      JOIN department_coordinators d 
        ON i.department_id = d.department_id
      WHERE d.dep_coordinator_id = ?;
    `;

    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error fetching completion percentage:", err);
        res.send({ error: "Database error" });
        return;
      }
      res.send({ status: true, results });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.send({ message: "Internal server error" });
  }
};


module.exports = {
  getReportsChartData,
  getIssuePriorityChartData,
  getIssueStatusChartData,
  getCompletionChartData
};
