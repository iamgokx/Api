const db = require('../../models/database');
const path = require('path');

const insertIssueMedia = (aadharNumber, image) => {
  const baseUploadPath = '/uploads/profile';
  console.log('see this you neeed it : ', image);

  const sqlInsertMedia = `UPDATE citizens 
  SET picture_name = ?, link = ? 
  WHERE aadhar_number = ?`;



  const filePath = path.join(baseUploadPath, image[0].filename);
  db.query(sqlInsertMedia, [image[0].filename, filePath, aadharNumber], (error, results) => {
    if (error) {
      console.log('Error inserting media:', error);
    } else {
   
      console.log(results);
      
    }
  });

};


const uploadPfp = (req, res) => {
  try {
  const { email } = req.body;
  const image = req.files;
  console.log('coming ', image);
  console.log('coming ', email);
 



    const sqlFindAadharNumber = `SELECT aadhar_number FROM citizen_aadhar_number WHERE citizen_id = ?`;


    db.query(sqlFindAadharNumber, [email], (error, results) => {
      if (error) {
        console.log('Error finding Aadhar number:', error);
        return res.status(500).send('Database error.');
      }

      if (results.length > 0) {
        const aadharNumber = results[0].aadhar_number;
        console.log('Aadhar number found:', aadharNumber);




        if (image) {
          insertIssueMedia(aadharNumber, image);
          res.status(200).send({ message: 'Profile picture uploaded successfully!' });
        } else {
          res.status(400).send('No profile picture uploaded.');
        }
      } else {
        res.status(404).send('User not found.');
      }
    });
  } catch (error) {
    console.log('Error inserting image:', error);
    res.status(500).send('Error processing request.');
  }
};



module.exports = { uploadPfp };
