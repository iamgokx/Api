
const db = require('../../models/database')
const path = require('path');
const insertProposalMedia = (proposalId, files, type) => {
  const baseUploadPath = type == 'media' ? '/uploads/userProposalsMedia' : '/uploads/userProposalFiles';
  const sqlInsertMedia = `INSERT INTO gov_proposal_media (gov_proposal_id, file_name, link) VALUES (?, ?, ?)`;

  files.forEach(file => {

    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");


    const ext = path.extname(file.filename);


    const nameWithoutExt = path.basename(file.filename, ext);


    const newFilename = `${nameWithoutExt}_${timestamp}${ext}`;


    const filePath = path.join(baseUploadPath, newFilename);

    db.query(sqlInsertMedia, [proposalId, file.filename, filePath], (error, results) => {
      if (error) {
        console.log('Error inserting media:', error);
      } else {
        console.log(`Media inserted for issue ID ${proposalId}:`, file.filename);
      }
    });
  });
};


const addProposal = (req, res) => {
  const files = req.files;
  console.log("filesdocuments ", files.documents);
  console.log("filesmedia ", files.media);

  const {
    user,
    title,
    description,
    latitude,
    longitude,
    generatedCity,
    generatedPincode,
    generatedAddress,
    generatedLocality,
    generatedState,
    budget,
    estimateTime,
  } = req.body;

  console.log(

    " user, title, description, latitude, longitude, generatedCity, generatedPincode, generatedAddress, generatedLocality, generatedState, budget, estimateTime: ",
    user,
    title,
    description,
    latitude,
    longitude,
    generatedCity,
    generatedPincode,
    generatedAddress,
    generatedLocality,
    generatedState,
    budget,
    estimateTime
  );

  const budgetMain = parseFloat(budget);

  if (isNaN(budgetMain)) {
    console.log("Budget is not a number.");
    return res.send({ status: false, message: "Invalid budget value." });
  }

  try {
    const sqlCheckPincode = `SELECT * FROM gov_proposals_pincode WHERE pincode = ?`;

    db.query(sqlCheckPincode, [generatedPincode], (error, results) => {
      if (error) {
        console.log("Error checking pincode:", error);
        return res.send({ status: false, message: "Database error while checking pincode." });
      }

      if (results.length > 0) {
        console.log("Pincode already exists");

        const sqlAddProposal = `INSERT INTO gov_proposals (
          dep_coordinator_id, 
          title, 
          proposal_description, 
          latitude, 
          longitude, 
          locality, 
          pincode, 
          estimated_completion_time, 
          budget
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sqlAddProposal, [user, title, description, latitude, longitude, generatedLocality, generatedPincode, estimateTime, budgetMain], (error, results) => {
          if (error) {
            console.log("Error adding proposal:", error);
            return res.send({ status: false, message: "Failed to add proposal." });
          }

          if (results.affectedRows > 0) {
            console.log("Proposal added to the DB");
            const proposal_id = results.insertId;

            if (files.media) {
              insertProposalMedia(proposal_id, files.media, "media");
            }

            if (files.documents) {
              insertProposalMedia(proposal_id, files.documents, "document");
            }

            return res.send({ status: true, message: "Proposal added successfully." });
          } else {
            return res.send({ status: false, message: "Proposal not added to the database." });
          }
        });
      } else {
        console.log("Need to add pincode first");

        const sqlAddPincode = `INSERT INTO gov_proposals_pincode VALUES (?, ?, ?)`;

        db.query(sqlAddPincode, [generatedPincode, generatedCity, generatedState], (error, results) => {
          if (error) {
            console.log("Error adding pincode:", error);
            return res.send({ status: false, message: "Failed to add pincode." });
          }

          if (results.affectedRows > 0) {
            console.log("Added pincode to the DB");

            const sqlAddProposal = `INSERT INTO gov_proposals (
              dep_coordinator_id, 
              title, 
              proposal_description, 
              latitude, 
              longitude, 
              locality, 
              pincode, 
              estimated_completion_time, 
              budget
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(sqlAddProposal, [user, title, description, latitude, longitude, generatedLocality, generatedPincode, estimateTime, budgetMain], (error, results) => {
              if (error) {
                console.log("Error adding proposal:", error);
                return res.send({ status: false, message: "Failed to add proposal after adding pincode." });
              }

              if (results.affectedRows > 0) {
                console.log("Proposal added to the DB");
                const proposal_id = results.insertId;

                if (files.media) {
                  insertProposalMedia(proposal_id, files.media, "media");
                }

                if (files.documents) {
                  insertProposalMedia(proposal_id, files.documents, "document");
                }

                console.log('reached the end');
                return res.send({ status: true, message: "Proposal added successfully" });
              } else {
                return res.send({ status: false, message: "Proposal not added to the database." });
              }
            });
          } else {
            return res.send({ status: false, message: "Could not add pincode." });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.send({ status: false, message: "Internal server error." });
  }
};



module.exports = {
  addProposal
}


