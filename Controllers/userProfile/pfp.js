const db = require('../../models/database');
const path = require('path');

const insertIssueMedia = (email, pfpFile) => {
  const baseUploadPath = '/uploads/profile';
  const sqlInsertMedia = `INSERT INTO citizens ( file_name, link) VALUES (?, ?,) WHERE citizen_id = ?`;
  //add email 
  mediaFiles.forEach(file => {
    const filePath = path.join(baseUploadPath, file.filename);
    db.query(sqlInsertMedia, [file.filename, filePath], (error, results) => {
      if (error) {
        console.log('Error inserting media:', error);
      } else {
        console.log(`Media inserted for issue ID ${issueId}:`, file.filename);
      }
    });
  });
};

const uploadPfp = (req, res) => {

  const { email } = req.body;

}




module.exports = { uploadPfp }