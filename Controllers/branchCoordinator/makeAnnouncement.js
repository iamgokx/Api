const db = require('../../models/database');
const path = require('path');

//TODO need to handel if there is no imgs sent or no documetns sent , as of nwo its crashing, remember to set required field in front end , solves the issues

const insertAnnouncementMedia = (announcement_id, mediaFiles, type) => {
  const baseUploadPath = type == 'media' ? '/uploads/govAnnouncementMedia' : '/uploads/govProposalFIles';
  const sqlInsertMedia = `insert into announcement_media values (?,?,?)`;

  mediaFiles.forEach(file => {
    const filePath = path.join(baseUploadPath, file.filename);
    db.query(sqlInsertMedia, [announcement_id, file.filename, filePath], (error, results) => {
      if (error) {
        console.log('Error inserting media:', error);
      } else {
        console.log(`Media inserted for announcement ID ${announcement_id}:`, file.filename);
      }
    });
  });
};



const addNewAnnouncement = (req, res) => {
  try {
    console.log("Receiving request for new announcement");

    const {
      email,
      district,
      taluka,
      title,
      generatedAddress,
      generatedCity,
      generatedPincode,
      generatedLocality,
      description,
      generatedState,
      latitude,
      longitude,
      announcementType,
    } = req.body;

    console.log("Request body:", email, district, taluka);
    console.log("Multer received files:", req.files);

    const files = req.files;
    console.log("Files documents:", files?.documents);
    console.log("Files media:", files?.media);

    const sqlAddAnnouncement = `insert into announcements (dep_coordinator_id, title, announcement_description, announcement_type) values (?,?,?,?)`;

    db.query(sqlAddAnnouncement, [email, title, description, announcementType], (error, results) => {
      if (error) {
        console.log("Error executing add announcement query:", error);
        return res.send({ error: "Database error while adding announcement" });
      }

      if (!results || results.affectedRows === 0) {
        console.log("Something went wrong while adding announcement.");
        return res.send({ error: "Failed to add announcement" });
      }

      console.log("Announcement added successfully:", results);
      const announcement_id = results.insertId;

      if (files?.media) {
        insertAnnouncementMedia(announcement_id, files.media, "media");
      }
      if (files?.documents) {
        insertAnnouncementMedia(announcement_id, files.documents, "documents");
      }

      console.log("This is district:", district);
      console.log("This is taluka:", taluka);

      if (district === "All") {
        console.log("District 'All' selected");
      }

      const sqlInsertTargetLocation = `insert into announcement_target_location(district, taluka) values (?,?)`;

      db.query(sqlInsertTargetLocation, [district, district === "All" ? "All" : taluka], (error, results) => {
        if (error) {
          console.log("Error executing insert target location query:", error);
          return res.send({ error: "Database error while adding target location" });
        }

        if (!results || results.affectedRows === 0) {
          console.log("No rows added in target location query");
          return res.send({ error: "Failed to add target location" });
        }

        console.log("Target location added successfully:", results);
        const location_id = results.insertId;

        const sqlAddAnnouncementLocation = `insert into announcement_location values (?,?)`;

        db.query(sqlAddAnnouncementLocation, [announcement_id, location_id], (error, results) => {
          if (error) {
            console.log("Error executing add announcement location query:", error);
            return res.send({ error: "Database error while linking announcement to location" });
          }

          if (!results || results.affectedRows === 0) {
            console.log("Failed to add location in junction table");
            return res.send({ error: "Failed to link announcement to location" });
          }

          console.log("Announcement location added successfully:", results);
          return res.send({ message: "Announcement added successfully!" });
        });
      });
    });
  } catch (error) {
    console.log("Unexpected error inserting announcement:", error);
    return res.send({ error: "Internal Server Error" });
  }
};




module.exports = { addNewAnnouncement }