const db = require('../../models/database')

const path = require('path');


const insertReportMedia = (reportid, files) => {
  const baseUploadPath = '/uploads/reports';
  const sqlInsertMedia = `INSERT INTO reports_media (report_id, file_name, link) VALUES (?, ?, ?)`;

  files.forEach(file => {
    const filePath = path.join(baseUploadPath, file.filename);
    db.query(sqlInsertMedia, [reportid, file.filename, filePath], (error, results) => {
      if (error) {
        console.log('Error inserting media:', error);
      } else {
        console.log(`Media inserted for issue ID ${reportid}:`, file.filename);
      }
    });
  });
};





const makeReport = (req, res) => {
  const files = req.files;
  console.log('files: ', files);
  console.log('filesdocuments ', files.documents);
  console.log('filesmedia ', files.media);

  const details = req.body
  try {

    const sqlAddReport = `insert into reports (issue_id,sub_branch_coordinator_id,title,report_description) values (?,?,?,?)`

    db.query(
      sqlAddReport, [details.issueId, details.email, details.title, details.description], (error, results) => {
        if (error) {
          console.log(error);
        }

        if (results.affectedRows > 0) {
          console.log('added report successfully');
          console.log(results);
          const id = results.insertId
          console.log('id: ', id);
          console.log('this is the main id : ', details.issueId);
          insertReportMedia(details.issueId, files.media)

          res.send({ status: true, message: 'Successfully added report' })
        } else {
          console.log('could not add report');
          res.send({ status: false, message: 'Could not add report , try again later' })
        }
      }
    )

  } catch (error) {
    console.log('error occurred here', error);
    res.send({ status: false, message: 'Something went wrong ' })
  }
}

module.exports = {
  makeReport
}