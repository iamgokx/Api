const db = require('../../models/database')

const getProfileIssueSuggestions = (req, res) => {

  const { email } = req.body
  console.log('email: ', email);

  try {
    const sql = `SELECT 
    i.issue_id AS id,
    'issue' AS type,
    i.title,
    i.locality,
    ip.city,
    ip.pincode,
    i.issue_description,
    isug.content AS suggestion,
    COALESCE(GROUP_CONCAT(im.file_name SEPARATOR ', '), 'No Media') AS media_files
FROM issues_suggestions isug
JOIN issues i ON isug.issue_id = i.issue_id
JOIN issues_pincode ip ON i.pincode = ip.pincode
LEFT JOIN issues_media im ON i.issue_id = im.issue_id
WHERE isug.citizen_id =?
GROUP BY i.issue_id, isug.content, i.title, i.locality, ip.city, i.issue_description
ORDER BY i.issue_id DESC;
`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no suggestions');
        res.send({ status: false, })
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: 'Something went wrong, please try again later...' })
  }
}

const getProfileCitizenProposalSuggestions = (req, res) => {

  const { email } = req.body
  console.log('email: ', email);

  try {
    const sql = `SELECT 
    cp.citizen_proposal_id AS id,
    'proposal' AS type,
    cp.title,
    cp.locality,
    cpp.city,
    cpp.pincode,
    cp.proposal_description,
    cps.content AS suggestion,
    COALESCE(GROUP_CONCAT(cpm.file_name SEPARATOR ', '), 'No Media') AS media_files
FROM citizen_proposals_suggestions cps
JOIN citizen_proposals cp ON cps.citizen_proposal_id = cp.citizen_proposal_id
JOIN citizen_proposal_pincodes cpp ON cp.pincode = cpp.pincode
LEFT JOIN citizen_proposal_media cpm ON cp.citizen_proposal_id = cpm.citizen_proposal_id
WHERE cps.citizen_id = ?
GROUP BY cp.citizen_proposal_id, cps.content, cp.title, cp.locality, cpp.city, cpp.pincode, cp.proposal_description
ORDER BY cp.citizen_proposal_id DESC;

`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no suggestions');
        res.send({ status: false, })
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: 'Something went wrong, please try again later...' })
  }
}

const getProfileGovProposalSuggestions = (req, res) => {

  const { email } = req.body
  console.log('email: ', email);

  try {
    const sql = `SELECT 
    gp.gov_proposal_id AS id,
    'gov_proposal' AS type,
    gp.title,
    gp.locality,
    gpp.city,
    gpp.pincode,
    gp.proposal_description,
    gps.content AS suggestion,
    COALESCE(GROUP_CONCAT(gpm.file_name SEPARATOR ', '), 'No Media') AS media_files
FROM gov_proposals_suggestions gps
JOIN gov_proposals gp ON gps.gov_proposal_id = gp.gov_proposal_id
JOIN gov_proposals_pincode gpp ON gp.pincode = gpp.pincode
LEFT JOIN gov_proposal_media gpm ON gp.gov_proposal_id = gpm.gov_proposal_id
WHERE gps.citizen_id = ?
GROUP BY gp.gov_proposal_id, gps.content, gp.title, gp.locality, gpp.city, gpp.pincode, gp.proposal_description
ORDER BY gp.gov_proposal_id DESC;


`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no suggestions');
        res.send({ status: false, })
      }
    })
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: 'Something went wrong, please try again later...' })
  }
}




module.exports = {
  getProfileIssueSuggestions, getProfileCitizenProposalSuggestions ,getProfileGovProposalSuggestions
}