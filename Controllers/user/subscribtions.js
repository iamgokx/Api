const db = require('../../models/database')

const getUserSubscriptions = (req, res) => {
  const { user } = req.body;

  try {

    const sql = `SELECT d.*, dc.department_name, dc.state
FROM department_subscribers d
JOIN department_coordinators dc ON d.department_id = dc.department_id
JOIN citizen_aadhar_number ca ON d.citizen_id = ca.aadhar_number
JOIN users u ON ca.citizen_id = u.email
WHERE u.email =? ;`

    db.query(sql, [user], (error, results) => {
      if (error) {
        console.log('erro executing get user subscriptions', error);
      }

      if (results.length > 0) {
        console.log(results);
        res.send({ status: true, results })
      } else {
        console.log('no subscriptions for ', user);
        res.send({ status: false })
      }
    })
  }
  catch (error) {
    console.log('error getting user subscriptions', error);
  }
}


//user req to subscribing to a department

const subscribe = (req, res) => {
  console.log('Receiving subscription request...');
  try {
    const { citizenId, department } = req.body;
    console.log('Request for subscription:', citizenId, department);

    // Check if user is already a subscriber 
    const sql = `SELECT * 
    FROM department_subscribers
    WHERE citizen_id = ? AND department_id = (
    SELECT department_id FROM department_coordinators WHERE department_name = ?
);`;

    db.query(sql, [citizenId, department], (error, results) => {
      if (error) {
        console.log('Error executing subscribe query:', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }

      if (results.length > 0) {
        console.log('Already a subscriber');
        return res.status(400).json({ success: false, message: "User already subscribed" });
      } else {
        console.log('Not a subscriber yet');

        const sqlGetDepId = `SELECT department_id FROM department_coordinators WHERE department_name = ?;`;

        db.query(sqlGetDepId, [department], (error, results) => {
          if (error) {
            console.log('Error executing get department ID query:', error);
            return res.status(500).json({ success: false, message: "Internal server error" });
          }
          if (results.length > 0) {
            console.log('ID of department found:', results[0].department_id);

            const depId = results[0].department_id;
            const sqlSubscribe = `INSERT INTO department_subscribers VALUES (?, ?);`;

            db.query(sqlSubscribe, [depId, citizenId], (error, results) => {
              if (error) {
                console.log('Error executing insert subscriber query:', error);
                return res.status(500).json({ success: false, message: "Internal server error" });
              }

              if (results.affectedRows > 0) {
                console.log('User subscription updated');
                return res.status(200).json({ success: true, message: "User subscribed successfully" });
              } else {
                console.log('Could not update user subscription');
                return res.status(500).json({ success: false, message: "Subscription failed" });
              }
            });

          } else {
            console.log('Could not find department ID');
            return res.status(404).json({ success: false, message: "Department not found" });
          }
        });
      }
    });

  } catch (error) {
    console.log('Error subscribing:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



//user req to unsubscribe from a department



const unSubscribe = (req, res) => {
  const { citizenId, department } = req.body
  console.log('citizenId, department: ', citizenId, department);

  try {
    const sqlGetDepartmentId = `select department_id from department_coordinators where department_name = ?;`

    db.query(sqlGetDepartmentId, [department], (error, results) => {
      if (error) {
        console.log('Error executing get department id query:', error);
      }

      if (results.length > 0) {
        const depId = results[0].department_id;
        console.log('department id : ', depId);

        const sqlDeleteSubscribtion = `delete from department_subscribers where citizen_id = ? AND department_id = ?;`

        db.query(sqlDeleteSubscribtion, [citizenId, depId], (error, results) => {
          if (error) {
            console.log('Error executing delete subscription query:', error);
          }

          if (results.affectedRows > 0) {
            console.log('Subscription successfully removed');
            res.send({ status: true })
          } else {
            console.log('Could not remove subscription');
            res.status(404).json({ status: false, message: "Subscription not found" });
          }
        })
      } else {
        console.log('Could not find department ID');
      }
    })
  } catch (error) {
    console.log(error);
  }

}



//function to get citizen id 

const getCitizenId = (req, res) => {

  const { email } = req.body;
  console.log('email for id ', email);

  try {

    const sql = `select aadhar_number from citizen_aadhar_number where citizen_id= ?;`

    db.query(sql, [email], (error, results) => {
      if (error) {
        console.log('Error executing find citizen id query:', error);
      }

      if (results.length > 0) {
        console.log(results[0].aadhar_number);
        const id = results[0].aadhar_number
        res.send({ status: true, id: id })
      }
    })

  } catch (error) {
    console.log('Error getting citizen id:', error);
  }
}



module.exports = {
  subscribe, unSubscribe, getUserSubscriptions, getCitizenId
}