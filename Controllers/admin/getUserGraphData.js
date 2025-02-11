const db = require('../../models/database')

const getUserGraphData = (req, res) => {
  const sql = 'select aadhar_number,status,registration_date_time from citizens'
  console.log('req receiving');
  try {
    db.query(sql, (error, results) => {
      if (error) {
        console.log('error executing getusergraphdata query', error);
      }

      if (results.length > 0) {
        console.log(results);
        res.send(results)
      }
    })

  } catch (error) {
    console.log('error gettting user graph data : ', error);
  }
}

const getUserGraphDataAllUsers = (req, res) => {
  const sql = 'select email,user_type from users'
 
  try {
    db.query(sql, (error, results) => {
      if (error) {
        console.log('error executing getusergraphdata query', error);
      }

      if (results.length > 0) {
        console.log(results);
        res.send(results)
      }
    })

  } catch (error) {
    console.log('error gettting user graph data : ', error);
  }
}





module.exports =
  { getUserGraphData, getUserGraphDataAllUsers }
