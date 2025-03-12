const db = require('../../models/database');
const path = require('path');

//TODO need to handel if there is no imgs sent or no documetns sent , as of nwo its crashing, remember to set required field in front end , solves the issues


const insertProposalMedia = (issueId, files, type) => {
  const baseUploadPath = type == 'media' ? '/uploads/userProposalsMedia' : '/uploads/userProposalFiles';
  const sqlInsertMedia = `INSERT INTO citizen_proposal_media (citizen_proposal_id, file_name, link) VALUES (?, ?, ?)`;

  files.forEach(file => {
    const filePath = path.join(baseUploadPath, file.filename);
    db.query(sqlInsertMedia, [issueId, file.filename, filePath], (error, results) => {
      if (error) {
        console.log('Error inserting media:', error);
      } else {
        console.log(`Media inserted for issue ID ${issueId}:`, file.filename);
      }
    });
  });
};

const insertUserProposal = (req, res) => {
  try {
    const { user, title, description, latitude, longitude, generatedCity, generatedPincode, generatedAddress, generatedLocality, generatedState } = req.body;
    console.log('generatedLocality: ', generatedLocality);

    const files = req.files;
    console.log('filesdocuments ', files.documents);
    console.log('filesmedia ', files.media);

    const sqlCheckPincode = `select * from citizen_proposal_pincodes where pincode = ?`

    db.query(sqlCheckPincode, [generatedPincode], (error, results) => {
      if (error) {
        console.log('error finding existing pincode : ', error);
      }

      if (results.length > 0) {
        console.log('pincode exists');

        const sqlInsertProposal = `insert into citizen_proposals (citizen_id,title,proposal_description,latitude,longitude,locality,pincode) values (?,?,?,?,?,?,?)`

        db.query(sqlInsertProposal, [user, title, description, latitude, longitude, generatedLocality, generatedPincode], (error, results) => {
          if (error) {
            console.log('error inserting proposal detials : ', error);
          }

          if (results.affectedRows > 0) {
            console.log('inserted proposal');
            const proposal_id = results.insertId

            if (files.media) {
              insertProposalMedia(proposal_id, files.media, 'media')

            }

            if (files.documents) {
              insertProposalMedia(proposal_id, files.documents, 'document')

            }
            res.json({ message: 'inserted proposal' })
          }
        })

      } else {
        console.log('pincode does not exist');
        const sqlInsertPincode = `Insert into citizen_proposal_pincodes values(?,?,?)`

        db.query(sqlInsertPincode, [generatedPincode, generatedCity, generatedState], (error, results) => {
          if (error) {
            console.log('error inserting pincode : ', error);
          }
          if (results.affectedRows > 0) {
            console.log('pincode inserted ');

            const sqlInsertProposal = `insert into citizen_proposals (citizen_id,title,proposal_description,latitude,longitude,locality,pincode) values (?,?,?,?,?,?,?)`

            db.query(sqlInsertProposal, [user, title, description, latitude, longitude, generatedLocality, generatedPincode], (error, results) => {
              if (error) {
                console.log('error inserting proposal detials : ', error);
              }

              if (results.affectedRows > 0) {
                console.log('inserted proposal');
                const proposal_id = results.insertId
                insertProposalMedia(proposal_id, files.media, 'media')
                insertProposalMedia(proposal_id, files.documents, 'document')
                res.json({ message: 'inserted proposal' })
              }
            })
          } else {
            console.log('could not insert pincode');
          }
        })
      }
    })

  } catch (error) {
    console.log(
      'error insertinguserproposal , ', error
    );
  }
}











module.exports = {
  insertUserProposal
}