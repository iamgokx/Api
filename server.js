const express = require('express')
const app = express();
const { router } = require('./routes/user')
const { issueRouter } = require('./routes/issues')
const { proposalRouter } = require('./routes/proposals')
const { adminRouter } = require('./routes/superAdmin')
const { branchCoordinator } = require('./routes/branchCoordinator')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const { initSocket } = require('./Controllers/socket/socketManager')
const http = require('http')
const server = http.createServer(app)
const { department } = require('./routes/department')
const { handleSocketConnection } = require('./Controllers/socket/socket');
const multer = require('multer');
const io = initSocket(server)
const { announcementsRouter } = require('./routes/announcements')
const { subBranchCoordinator } = require('./routes/subBranchCoordinator')
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

io.on('connect', (socket) => {
  console.log('User socket connected: ', socket.id);
  handleSocketConnection(io, socket)

 
  socket.on('setup', email =>{
    console.log('email : ', email);
  })
});


server.listen(8000, console.log('server running at 8000'))