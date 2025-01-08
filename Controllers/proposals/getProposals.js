const db = require('../../models/database')

const getUserProposals = (req, res) => {
  try {


    const sqlGetCitizenProposals = `SELECT 
    cp.citizen_proposal_id,
    cp.title,
    cp.proposal_description,
    cp.date_time_created,
    cp.latitude,
    cp.longitude,
    cp.locality,
    cp.pincode,
    u.email AS citizen_email,
    u.full_name AS citizen_name,
    u.phone_number AS citizen_phone,
    u.user_type AS user_type,
    c.picture_name AS citizen_picture_name,
    GROUP_CONCAT(DISTINCT cpm.file_name SEPARATOR ', ') AS media_files,
    (SELECT COUNT(*) 
     FROM citizen_proposals_suggestions cs 
     WHERE cs.citizen_proposal_id = cp.citizen_proposal_id) AS suggestion_count
FROM 
    citizen_proposals cp
JOIN 
    citizen_aadhar_number can ON cp.citizen_id = can.citizen_id
JOIN 
    users u ON can.citizen_id = u.email
JOIN 
    citizens c ON can.aadhar_number = c.aadhar_number
LEFT JOIN 
    citizen_proposal_media cpm ON cp.citizen_proposal_id = cpm.citizen_proposal_id
GROUP BY 
    cp.citizen_proposal_id, 
    cp.title, 
    cp.proposal_description, 
    cp.date_time_created, 
    cp.latitude, 
    cp.longitude, 
    cp.locality, 
    cp.pincode, 
    u.email, 
    u.full_name, 
    u.phone_number, 
    u.user_type, 
    c.picture_name;

`

    db.query(sqlGetCitizenProposals, (error, results) => {
      if (error) {
        console.log('error getting results for citizen proposals from database');
      }

      if (results.length > 0) {

        res.json(results)
      }
    })
  } catch (error) {
    console.log('error getting user proposals  : ', error);
  }
}

const getUserDetailedProposals = (req, res) => {
  const { proposalId } = req.body

  try {

    const sqlGetDetailedSuggestion = `SELECT 
    cp.citizen_proposal_id,
    cp.title,
    cp.proposal_description,
    cp.date_time_created,
    cp.latitude,
    cp.longitude,
    cp.locality,
    cp.pincode,
    u.email AS citizen_email,
    u.full_name AS citizen_name,
    u.phone_number AS citizen_phone,
    u.user_type AS user_type,
    c.picture_name AS citizen_picture_name,
    -- Aggregate media files in a subquery to avoid duplication
    (SELECT GROUP_CONCAT(file_name SEPARATOR ', ') 
     FROM citizen_proposal_media cpm 
     WHERE cpm.citizen_proposal_id = cp.citizen_proposal_id) AS media_files,
    -- Count suggestions in a subquery to avoid duplication
    (SELECT COUNT(*) 
     FROM citizen_proposals_suggestions cs 
     WHERE cs.citizen_proposal_id = cp.citizen_proposal_id) AS suggestion_count
FROM 
    citizen_proposals cp
JOIN 
    citizen_aadhar_number can ON cp.citizen_id = can.citizen_id
JOIN 
    users u ON can.citizen_id = u.email
JOIN 
    citizens c ON can.aadhar_number = c.aadhar_number
WHERE 
    cp.citizen_proposal_id = ?
GROUP BY 
    cp.citizen_proposal_id, 
    cp.title, 
    cp.proposal_description, 
    cp.date_time_created, 
    cp.latitude, 
    cp.longitude, 
    cp.locality, 
    cp.pincode, 
    u.email, 
    u.full_name, 
    u.phone_number, 
    u.user_type, 
    c.picture_name;

`

    db.query(sqlGetDetailedSuggestion, [proposalId], (error, results) => {
      if (error) {
        console.log('error executing query of getting detailed proposal : ', error);
      }

      if (results.length > 0) {

        res.json(results)
      }
    })
  } catch (errorf) {
    console.log('error getting detailed proposal : ', error);
  }
}


const getUserPersonalProposals = (req, res) => {
  const { email } = req.body;

  try {
    const sqlGetPersonalUserProposal = `
SELECT
    cp.citizen_proposal_id,
    cp.title,
    cp.proposal_description,
    cp.date_time_created,
    cp.latitude,
    cp.longitude,
    cp.locality,
    cp.pincode,
    u.email AS citizen_email,
    u.full_name AS citizen_name,
    u.phone_number AS citizen_phone,
    u.user_type AS user_type,
    c.picture_name AS citizen_picture_name,
    GROUP_CONCAT(cpm.file_name SEPARATOR ', ') AS media_files
FROM
    citizen_proposals cp
JOIN
    citizen_aadhar_number can ON cp.citizen_id = can.citizen_id
JOIN
    users u ON can.citizen_id = u.email
JOIN
    citizens c ON can.aadhar_number = c.aadhar_number
LEFT JOIN
    citizen_proposal_media cpm ON cp.citizen_proposal_id = cpm.citizen_proposal_id
WHERE
    cp.citizen_id = ?
GROUP BY
    cp.citizen_proposal_id,
    cp.title,
    cp.proposal_description,
    cp.date_time_created,
    cp.latitude,
    cp.longitude,
    cp.locality,
    cp.pincode,
    u.email,
    u.full_name,
    u.phone_number,
    u.user_type,
    c.picture_name;`

    db.query(sqlGetPersonalUserProposal, [email], (error, results) => {
      if (error) {
        console.log('error executing user personal proposal query  : ', error);
      }

      if (results.length > 0) {
        console.log(results);
        res.json(results)
      }
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUserProposals, getUserDetailedProposals, getUserPersonalProposals }