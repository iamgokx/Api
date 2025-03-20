const db = require('../../models/database')



const getAnnouncementsForUser = (req, res) => {
  try {
    const sqlGetAnnouncements = `SELECT 
    a.announcement_id,
    a.dep_coordinator_id,
    dc.department_name,
    dc.department_id,
    dc.state,
    a.title,
    a.announcement_description,
    a.date_time_created,
    a.announcement_type,
    COALESCE(GROUP_CONCAT(DISTINCT am.file_name SEPARATOR ','), '') AS media_links,
    COALESCE(GROUP_CONCAT(DISTINCT CONCAT(atl.district, ' - ', atl.taluka) SEPARATOR ', '), '') AS target_locations
FROM announcements a
LEFT JOIN department_coordinators dc ON a.dep_coordinator_id = dc.dep_coordinator_id
LEFT JOIN announcement_media am ON a.announcement_id = am.announcement_id
LEFT JOIN announcement_location al ON a.announcement_id = al.announcement_id
LEFT JOIN announcement_target_location atl ON al.location_id = atl.location_id
GROUP BY 
    a.announcement_id, a.dep_coordinator_id, dc.department_name, dc.department_id, dc.state,
    a.title, a.announcement_description, a.date_time_created, a.announcement_type;
`

    db.query(sqlGetAnnouncements, (error, results) => {
      if (error) {
        console.log('error executing get announcements query');
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no announcements found');
        res.send({ status: false })
      }


    })
  } catch (error) {
    console.log(error);
  }
}


const getDetailedAnnouncement = (req, res) => {
  try {
    const { announcement_id } = req.body
    console.log('announcement_id: ', announcement_id);

    const sql = `SELECT 
    a.announcement_id,
    a.dep_coordinator_id,
    dc.department_name,
    dc.state AS department_state,
    a.title,
    a.announcement_description,
    a.date_time_created,
    a.announcement_type,
    GROUP_CONCAT(DISTINCT am.file_name ORDER BY am.file_name ASC SEPARATOR ', ') AS media_files,
    GROUP_CONCAT(DISTINCT am.link ORDER BY am.link ASC SEPARATOR ', ') AS media_links,
    GROUP_CONCAT(DISTINCT atl.district ORDER BY atl.district ASC SEPARATOR ', ') AS districts,
    GROUP_CONCAT(DISTINCT atl.taluka ORDER BY atl.taluka ASC SEPARATOR ', ') AS talukas
FROM announcements a
LEFT JOIN announcement_media am ON a.announcement_id = am.announcement_id
LEFT JOIN announcement_location al ON a.announcement_id = al.announcement_id
LEFT JOIN announcement_target_location atl ON al.location_id = atl.location_id
LEFT JOIN department_coordinators dc ON a.dep_coordinator_id = dc.dep_coordinator_id
WHERE a.announcement_id = ?
GROUP BY a.announcement_id, dc.department_name, dc.state;`

    db.query(sql, [announcement_id], (error, results) => {
      if (error) {
        console.log('error executing get detailed announcement query');
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no data for announcement : ', announcement_id);
        res.send({ status: false })
      }
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAnnouncementsForUser, getDetailedAnnouncement
}