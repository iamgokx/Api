const handleSocketConnection = (io, socket) => {
  console.log('user connected');
  io.emit('hello', 'Welcome to the app');
  console.log('Message "Welcome to the app" sent');


  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });

}

module.exports = {
  handleSocketConnection
}