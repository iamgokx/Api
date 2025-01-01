const db = require('../../models/database');
const path = require('path');

const insertProposalMedia = (issueId, mediaFiles) => {
  const baseUploadPath = '/uploads/userProposals';
  const sqlInsertMedia = `INSERT INTO issues_media (issue_id, file_name, link) VALUES (?, ?, ?)`;

  mediaFiles.forEach(file => {
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
                res.json({message : 'inserted proposal'})
              }})

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
                res.json({message : 'inserted proposal'})
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