const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS,
  },
});

const reportProblem = async (req, res) => {
  console.log('Receiving problem report');
  
  const { email, problemText } = req.body;
  
  if (!email || !problemText) {
    return res.status(400).json({ status: false, message: 'Email and problem description are required' });
  }

  console.log('Reported by:', email);
  console.log('Problem:', problemText);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'lekhwargokul84@gmail.com',
    subject: 'New Problem Reported - SpotFix',
    text: `A new problem has been reported by ${email}.

Problem Details:
----------------
${problemText}

Please take necessary action.

Regards,
SpotFix System`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.json({ status: true, message: 'Problem reported successfully, email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ status: false, message: 'Failed to send email' });
  }
};

module.exports = {
  reportProblem,
};
