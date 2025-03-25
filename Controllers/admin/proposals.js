const db = require('../../models/database');
const { sendNotification } = require('../../socketData/manageSocket');

const approveProposal = (req, res) => {
  console.log('getting approval req');
  try {
    const { proposalId } = req.body
    console.log('proposalId: ', proposalId);

    const sql = `update citizen_proposals set proposal_status = 'approved' where citizen_proposal_id = ?;`

    db.query(sql, [proposalId], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }

      if (results.affectedRows > 0) {
        console.log('proposal approved');

        const sql = `select citizen_id, title from citizen_proposals where citizen_proposal_id = ?`
        db.query(sql, [proposalId], (error, results) => {
          if (error) {
            console.log(error);
          }
          const user = results[0].citizen_id
          const title = results[0].title
          console.log('user rejection mail : ', user);
          sendNotification(user, `Your proposal (${title}) was approved by the admin.`)
        })

        res.send({ status: true, message: `Proposal status successfully updated to 'Approved'` })
      } else {
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }
    })
  } catch (error) {
    console.log(error);
  }
}

const rejectProposal = (req, res) => {
  console.log('getting rejection req');
  try {
    const { proposalId } = req.body
    console.log('proposalId: ', proposalId);

    const sql = `update citizen_proposals set proposal_status = 'rejected' where citizen_proposal_id = ?;`

    db.query(sql, [proposalId], (error, results) => {
      if (error) {
        console.log(error);
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }

      if (results.affectedRows > 0) {
        console.log('proposal rejected');

        const sql = `select citizen_id, title from citizen_proposals where citizen_proposal_id = ?`
        db.query(sql, [proposalId], (error, results) => {
          if (error) {
            console.log(error);
          }
          const user = results[0].citizen_id
          const title = results[0].title
          console.log('user rejection mail : ', user);
          sendNotification(user, `sorry your proposal (${title}) was rejected by the admin.`)
        })

        res.send({ status: true, message: `Proposal status successfully updated to 'Approved'` })
      } else {
        res.send({ status: false, message: 'Something went wrong, please try again later...' })
      }
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  approveProposal, rejectProposal
}