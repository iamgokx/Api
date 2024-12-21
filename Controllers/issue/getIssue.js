const db = require('../../models/database')

const getIssues = (req, res) => {
  try {
    const sqlGetIssues = `
SELECT 
i.*,
    u.full_name, 
    u.email, 
    GROUP_CONCAT(DISTINCT im.file_name) AS media_files, 
    GROUP_CONCAT(DISTINCT im.link) AS media_links, 
    (SELECT COUNT(*) FROM citizen_issues_votes civ WHERE civ.issue_id = i.issue_id AND civ.type = 'upvote') AS upvote_count, 
    (SELECT COUNT(*) FROM citizen_issues_votes civ WHERE civ.issue_id = i.issue_id AND civ.type = 'downvote') AS downvote_count, 
    (SELECT COUNT(*) FROM issues_suggestions s WHERE s.issue_id = i.issue_id) AS total_suggestions
FROM 
    issues i
JOIN 
    citizen_aadhar_number c_a ON i.citizen_id = c_a.citizen_id
JOIN 
    users u ON c_a.citizen_id = u.email
LEFT JOIN 
    issues_media im ON i.issue_id = im.issue_id
GROUP BY 
    i.issue_id, 
    u.full_name, 
    u.email;
`

    db.query(sqlGetIssues, (error, results) => {
      if (error) {
        console.log('error finding issues :  ', error);
      }
      console.log('Home results', results);
      res.json(results)
    })
  } catch (error) {
    if (error) {
      console.log('error getting issues : ', error);
    }
  }

}


const getDetailedIssue = (req, res) => {
  const { issue_id } = req.body
  try {

    const sqlFindDetailedIssue = `SELECT 
    I.issue_id,
    I.title,
    I.issue_description,
    I.solution,
    I.category,
    I.priority,
    I.issue_status,
    I.time_edited,
    I.date_time_created,
    I.date_completed,
    I.is_anonymous,
    I.estimate_complete_time,
    I.rating,
    I.feedback_text,
    I.date_time_submitted,
    I.latitude,
    I.longitude,
    I.locality,
    I.pincode,
    C.aadhar_number AS citizen_aadhar,
    C.locality AS citizen_locality,
    U.full_name,
    COALESCE(media_files.media_files, '') AS media_files,  
    COALESCE(vote_counts.upvote_count, 0) AS upvote_count,
    COALESCE(vote_counts.downvote_count, 0) AS downvote_count,
    COALESCE(suggestion_counts.total_suggestions, 0) AS total_suggestions
FROM issues I

-- Link citizen ID with citizen Aadhaar
LEFT JOIN citizen_aadhar_number CAN ON I.citizen_id = CAN.citizen_id

-- Get citizen details
LEFT JOIN citizens C ON CAN.aadhar_number = C.aadhar_number

-- Get user full name
LEFT JOIN users U ON CAN.citizen_id = U.email

-- Aggregate media files
LEFT JOIN (
    SELECT issue_id, GROUP_CONCAT(file_name) AS media_files
    FROM issues_media
    GROUP BY issue_id
) media_files ON I.issue_id = media_files.issue_id

-- Aggregate votes
LEFT JOIN (
    SELECT 
        issue_id,
        SUM(CASE WHEN type = 'upvote' THEN 1 ELSE 0 END) AS upvote_count,
        SUM(CASE WHEN type = 'downvote' THEN 1 ELSE 0 END) AS downvote_count
    FROM citizen_issues_votes
    GROUP BY issue_id
) vote_counts ON I.issue_id = vote_counts.issue_id

-- Aggregate suggestions
LEFT JOIN (
    SELECT 
        issue_id, 
        COUNT(*) AS total_suggestions
    FROM issues_suggestions
    GROUP BY issue_id
) suggestion_counts ON I.issue_id = suggestion_counts.issue_id

WHERE I.issue_id = ?
GROUP BY 
    I.issue_id, 
    I.title,
    I.issue_description,
    I.solution,
    I.category,
    I.priority,
    I.issue_status,
    I.time_edited,
    I.date_time_created,
    I.date_completed,
    I.is_anonymous,
    I.estimate_complete_time,
    I.rating,
    I.feedback_text,
    I.date_time_submitted,
    I.latitude,
    I.longitude,
    I.locality,
    I.pincode,
    C.aadhar_number, 
    C.locality, 
    U.full_name,
    media_files.media_files,
    vote_counts.upvote_count,
    vote_counts.downvote_count,
    suggestion_counts.total_suggestions;

`

    db.query(sqlFindDetailedIssue, [issue_id], (error, results) => {
      if (error) {
        console.log('error executing detailed find query : ', error);
      }

      console.log('detailed issues details ', results[0]);
      res.json(results[0])

    })
  } catch (error) {
    console.log('error finding detailed information on issue : ', error);
  }
}

module.exports = {
  getIssues, getDetailedIssue
}