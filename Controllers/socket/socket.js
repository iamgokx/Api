const handleSocketConnection = (io, socket) => {
  console.log('user connected');
  io.emit('hello', 'Welcome to the app');

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });

}

module.exports = {
  handleSocketConnection
}