const jwt = require('jsonwebtoken')
require('dotenv').config()
const { jwtDecode } = require('jwt-decode')
const SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_EXPIRATION = '7d'
const db = require('../../models/database');
const { sendNotification } = require('../../socketData/manageSocket')

const generateJWT = (req, res) => {


  try {
    const details = req.body;

    const sqlfinduser = `SELECT u.user_type, c.picture_name
FROM users u
LEFT JOIN citizen_aadhar_number ca ON u.email = ca.citizen_id
LEFT JOIN citizens c ON ca.aadhar_number = c.aadhar_number
WHERE u.email = ?;`

    db.query(sqlfinduser, [details.email], (error, results) => {
      if (error) {
        console.log('error finding user details for jwt , ', error);
      }

      if (results.length > 0) {
        console.log(results[0].user_type);
        console.log(results[0].picture_name);
        const userType = results[0].user_type;
        const payload = {
          email: details.email,
          name: details.name,
          userType: userType,
          picture: results[0].picture_name
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRATION })
        console.log('token from backend ', jwtDecode(token));
        return res.json({ token, userType });
      }
    })




  } catch (error) {
    console.log('error creating jwt : ', error)
  }
}





const verifyJwt = (req, res) => {

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required", jwtStatus: false });
  }

  const secretKey = SECRET_KEY;

  try {

    const decodedToken = jwt.verify(token, secretKey);
    console.log("Decoded Token:", decodedToken);

    const { email, name, userType } = decodedToken;
    console.log('email: ', email);



    const sql = 'SELECT * FROM users WHERE email = ? AND full_name = ? AND user_type = ?';
    db.query(sql, [email, name, userType], (error, results) => {
      if (error) {
        console.error('Error verifying JWT:', error);
        return res.status(500).json({ message: 'Internal Server Error', jwtStatus: false });
      }

      if (results.length > 0) {
        console.log("User found in database:", results);

        return res.json({ message: 'User JWT Valid', jwtStatus: true, user_type: results[0].user_type });
      } else {
        console.log('could not find user');
        return res.json({ message: 'User JWT Invalid', jwtStatus: false });
      }
    });
  } catch (error) {

    console.error("Token verification error:", error);
    if (error.name === "TokenExpiredError") {
      return res.json({ message: "Token has expired", jwtStatus: false });
    } else if (error.name === "JsonWebTokenError") {
      return res.json({ message: "Invalid token", jwtStatus: false });
    } else {
      return res.json({ message: "Token verification failed", jwtStatus: false });
    }
  }
};

module.exports = { generateJWT, verifyJwt }