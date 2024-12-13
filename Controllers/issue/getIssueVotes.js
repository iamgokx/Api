const db = require('../../models/database')
const { jwtDecode } = require('jwt-decode');

const getIssueVotes = (req, res) => {
  const { issue_id } = req.query;

  try {
    const sqlGetIssueVotes = `SELECT 
    type, 
    COUNT(*) AS vote_count
      FROM 
        citizen_issues_votes
      WHERE 
        issue_id = ?
      GROUP BY 
        type;
`;

    db.query(sqlGetIssueVotes, [issue_id], (error, results) => {
      if (error) {
        console.log('error executing get issues query : ', error);
      }

      if (results.length > 0) {
        res.json({ results })
      }
    })
  } catch (error) {
    console.log('error getting issue votes : ', error);
  }
}


const addIssueVote = async (req, res) => {
  const { voteType, email, issue_id } = req.body;

  try {
    const sqlGetAadharNumber = `SELECT aadhar_number 
            FROM citizen_aadhar_number 
            WHERE citizen_id = ?;`;

    db.query(sqlGetAadharNumber, [email], (error, results) => {
      if (error) {
        console.error('Error fetching Aadhar Card Number:', error);
        return res.status(500).send('Error fetching Aadhar Card Number');
      }

      if (results.length > 0) {
        const aadharNumber = results[0].aadhar_number;
        const sqlCheckExistingVote = `SELECT type 
        FROM citizen_issues_votes 
        WHERE citizen_id = ? AND issue_id = ?;`;

        db.query(sqlCheckExistingVote, [aadharNumber, issue_id], (error, existingVoteResults) => {
          if (error) {
            console.error('Error checking existing votes:', error);
            return res.status(500).send('Error checking existing votes');
          }

          if (existingVoteResults.length > 0) {
            const existingVote = existingVoteResults[0].type;
            if (existingVote == voteType) {
              
              const sqlRemoveExistingVote = `DELETE 
                FROM citizen_issues_votes 
                WHERE citizen_id = ? AND issue_id = ?;`;

              db.query(sqlRemoveExistingVote, [aadharNumber, issue_id], (error, results) => {
                if (error) {
                  console.error('Error removing existing vote:', error);
                  return res.status(500).send('Error removing existing vote');
                }

                if (results.affectedRows > 0) {
                  console.log('Removed existing vote');
                  return res.status(200).send('Vote removed successfully');
                } else {
                  console.error('Could not remove existing vote');
                  return res.status(400).send('Could not remove existing vote');
                }
              });
            } else {
              
              const sqlChangeVoteType = `UPDATE citizen_issues_votes 
                SET type = ?, date_time_created = CURRENT_TIMESTAMP 
                WHERE citizen_id = ? AND issue_id = ?;`;

              db.query(sqlChangeVoteType, [voteType, aadharNumber, issue_id], (error, changeVoteResults) => {
                if (error) {
                  console.error('Error changing votes:', error);
                  return res.status(500).send('Error changing vote');
                }

                if (changeVoteResults.affectedRows > 0) {
                  console.log('Vote type changed');
                  return res.status(200).send('Vote type updated successfully');
                } else {
                  console.error('Failed to change vote type');
                  return res.status(400).send('Failed to change vote type');
                }
              });
            }
          } else {
            
            const sqlAddNewVote = `INSERT INTO citizen_issues_votes (citizen_id, issue_id, type, date_time_created)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP);`;

            db.query(sqlAddNewVote, [aadharNumber, issue_id, voteType], (error, addVoteResults) => {
              if (error) {
                console.error('Error adding new vote:', error);
                return res.status(500).send('Error adding new vote');
              }

              if (addVoteResults.affectedRows > 0) {
                console.log('Added vote successfully');
                return res.status(201).send('Vote added successfully');
              } else {
                console.error('Failed to add vote');
                return res.status(400).send('Failed to add vote');
              }
            });
          }
        });
      } else {
        console.log('Aadhar number does not exist');
        return res.status(404).send('Aadhar number does not exist');
      }
    });
  } catch (error) {
    console.error('Error trying to add or remove vote:', error);
    return res.status(500).send('Internal server error');
  }
};


module.exports = {
  getIssueVotes, addIssueVote
}