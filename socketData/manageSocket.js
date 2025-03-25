const fs = require('fs').promises;
const path = require('path');
const { getIO } = require('../Controllers/socket/socketManager');
const userSocketsFile = path.join(__dirname, '/userSockets.json');

const io = getIO();

async function readUserSockets() {
  try {
    const data = await fs.readFile(userSocketsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading userSockets.json:', error);
    return {};
  }
}

async function writeUserSockets(userSockets) {
  try {
    await fs.writeFile(userSocketsFile, JSON.stringify(userSockets, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to userSockets.json:', error);
  }
}


async function sendNotification(email, message) {
  let userSockets = await readUserSockets();
  const socketId = userSockets[email];
  console.log({ socketId });

  if (socketId) {
    io.to(socketId).emit('notification', message);

    console.log(`Notification sent to ${email}`);
  } else {
    console.log(`User ${email} is offline.`);
  }
}

module.exports = { readUserSockets, writeUserSockets, sendNotification };
