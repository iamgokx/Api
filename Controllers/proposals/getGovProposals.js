const db = require('../../models/database')

const getGovProposals = (req, res) => {
  try {

    const sqlGetCitizenProposals = `SELECT 
    gp.gov_proposal_id,
    gp.title,
    gp.proposal_description,
    gp.date_time_created,
    gp.latitude,
    gp.longitude,
    gp.locality,
    gp.pincode,
    gp.estimated_completion_time,
    gp.budget,
    dc.department_name AS department_name,
    dc.state AS department_state,
    u.email AS coordinator_email,
    u.full_name AS coordinator_name,
    u.phone_number AS coordinator_phone,
    u.user_type AS user_type,
    GROUP_CONCAT(DISTINCT gpm.file_name SEPARATOR ', ') AS media_files,
    (SELECT COUNT(*) 
     FROM gov_proposals_suggestions gps 
     WHERE gps.gov_proposal_id = gp.gov_proposal_id) AS suggestion_count
FROM 
    gov_proposals gp
JOIN 
    department_coordinators dc ON gp.dep_coordinator_id = dc.dep_coordinator_id
JOIN 
    users u ON dc.dep_coordinator_id = u.email
LEFT JOIN 
    gov_proposal_media gpm ON gp.gov_proposal_id = gpm.gov_proposal_id
GROUP BY 
    gp.gov_proposal_id, 
    gp.title, 
    gp.proposal_description, 
    gp.date_time_created, 
    gp.latitude, 
    gp.longitude, 
    gp.locality, 
    gp.pincode, 
    gp.estimated_completion_time, 
    gp.budget, 
    dc.department_name, 
    dc.state, 
    u.email, 
    u.full_name, 
    u.phone_number, 
    u.user_type;


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

const getGovDetailedProposal = (req, res) => {
  const { proposalId } = req.body

  try {

    const sqlGetDetailedSuggestion = `SELECT 
    gp.gov_proposal_id,
    gp.title,
    gp.proposal_description,
    gp.date_time_created,
    gp.latitude,
    gp.longitude,
    gp.locality,
    gp.pincode,
    gp.estimated_completion_time,
    gp.budget,
    dc.department_name,  -- Added department name
    u.email AS dep_coordinator_email,
    u.full_name AS dep_coordinator_name,
    u.phone_number AS dep_coordinator_phone,
    u.user_type AS user_type,
    -- Aggregate media files in a subquery to avoid duplication
    (SELECT GROUP_CONCAT(file_name SEPARATOR ', ') 
     FROM gov_proposal_media gpm 
     WHERE gpm.gov_proposal_id = gp.gov_proposal_id) AS media_files,
    -- Count suggestions in a subquery to avoid duplication
    (SELECT COUNT(*) 
     FROM gov_proposals_suggestions gs 
     WHERE gs.gov_proposal_id = gp.gov_proposal_id) AS suggestion_count
FROM 
    gov_proposals gp
JOIN 
    department_coordinators dc ON gp.dep_coordinator_id = dc.dep_coordinator_id
JOIN 
    users u ON dc.dep_coordinator_id = u.email
WHERE 
    gp.gov_proposal_id = ?
GROUP BY 
    gp.gov_proposal_id, 
    gp.title, 
    gp.proposal_description, 
    gp.date_time_created, 
    gp.latitude, 
    gp.longitude, 
    gp.locality, 
    gp.pincode, 
    gp.estimated_completion_time,
    gp.budget,
    dc.department_name,  -- Group by department name
    u.email, 
    u.full_name, 
    u.phone_number, 
    u.user_type;



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


const getGovIndividualProposals = (req, res) => {
  const { email } = req.body;

  try {
    const sqlGetPersonalUserProposal = `

    SELECT 
    gp.gov_proposal_id,
    gp.title,
    gp.proposal_description,
    gp.date_time_created,
    gp.latitude,
    gp.longitude,
    gp.locality,
    gp.pincode,
    gp.estimated_completion_time,
    gp.budget,
    dc.department_name AS department_name,
    dc.state AS department_state,
    u.email AS coordinator_email,
    u.full_name AS coordinator_name,
    u.phone_number AS coordinator_phone,
    u.user_type AS user_type,
    GROUP_CONCAT(DISTINCT gpm.file_name SEPARATOR ', ') AS media_files,
    (SELECT COUNT(*) 
     FROM gov_proposals_suggestions gps 
     WHERE gps.gov_proposal_id = gp.gov_proposal_id) AS suggestion_count
FROM 
    gov_proposals gp
JOIN 
    department_coordinators dc ON gp.dep_coordinator_id = dc.dep_coordinator_id
JOIN 
    users u ON dc.dep_coordinator_id = u.email
LEFT JOIN 
    gov_proposal_media gpm ON gp.gov_proposal_id = gpm.gov_proposal_id
WHERE 
    u.email = ?
GROUP BY 
    gp.gov_proposal_id, 
    gp.title, 
    gp.proposal_description, 
    gp.date_time_created, 
    gp.latitude, 
    gp.longitude, 
    gp.locality, 
    gp.pincode, 
    gp.estimated_completion_time, 
    gp.budget, 
    dc.department_name, 
    dc.state, 
    u.email, 
    u.full_name, 
    u.phone_number, 
    u.user_type;
`

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

module.exports = { getGovProposals, getGovDetailedProposal, getGovIndividualProposals }