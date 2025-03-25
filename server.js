const express = require('express')
const app = express();
const http = require('http')
const axios = require('axios')
const server = http.createServer(app)
const { initSocket } = require('./Controllers/socket/socketManager')
const io = initSocket(server);
const { router } = require('./routes/user')
const { issueRouter } = require('./routes/issues')
const { proposalRouter } = require('./routes/proposals')
const { adminRouter } = require('./routes/superAdmin')
const { branchCoordinator } = require('./routes/branchCoordinator')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const { department } = require('./routes/department')
const { handleSocketConnection } = require('./Controllers/socket/socket');
const multer = require('multer');
const { announcementsRouter } = require('./routes/announcements')
const { subBranchCoordinator } = require('./routes/subBranchCoordinator');


const { readUserSockets, writeUserSockets, sendNotification } = require('./socketData/manageSocket');

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, }));
app.use(bodyParser.json());



app.use('/api/users', router);
app.use('/api/issues', issueRouter)
app.use('/api/proposals', proposalRouter)
app.use('/api/admin', adminRouter)
app.use('/api/branchCoordinator', branchCoordinator)
app.use('/api/department', department)
app.use('/api/announcements', announcementsRouter)
app.use('/api/subBranchCoordinator', subBranchCoordinator)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

io.on('connect', async (socket) => {
  console.log('User connected:', socket.id);

  socket.on('setup', async (email) => {
    console.log('User email:', email);

    let userSockets = await readUserSockets();
    userSockets[email] = socket.id;
    await writeUserSockets(userSockets);

    
  
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);

    let userSockets = await readUserSockets();
    const userEmail = Object.keys(userSockets).find(email => userSockets[email] === socket.id);
    if (userEmail) {
      delete userSockets[userEmail];
      await writeUserSockets(userSockets);
    }
  });
});




server.listen(8000, console.log('server running at 8000'))