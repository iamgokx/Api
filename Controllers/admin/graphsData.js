const db = require('../../models/database');

const getReportsChartData = (req, res) => {
  console.log('Fetching report chart data for all departments');
  try {
    const query = `
      SELECT DATE_FORMAT(date_time_created, '%b %Y') AS month_year, 
             COUNT(*) AS report_count
      FROM reports
      GROUP BY month_year
      ORDER BY STR_TO_DATE(month_year, '%b %Y');
    `;

    db.query(query, (err, results) => {
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
  console.log('Fetching issue priority chart data for all departments');
  try {
    const query = `
      SELECT priority AS category, 
             COUNT(issue_id) AS value
      FROM issues
      GROUP BY priority;
    `;

    db.query(query, (err, results) => {
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
  console.log('Fetching issue status chart data for all departments');
  try {
    const query = `
      SELECT issue_status AS category, 
             COUNT(issue_id) AS value
      FROM issues
      GROUP BY issue_status;
    `;

    db.query(query, (err, results) => {
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
  console.log('Fetching completion percentage for all departments');
  try {
    const query = `
      SELECT 'Completed %' AS category,
             (COUNT(CASE WHEN issue_status = 'completed' THEN 1 END) / COUNT(issue_id)) * 100 AS value
      FROM issues;
    `;

    db.query(query, (err, results) => {
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
