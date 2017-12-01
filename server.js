const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();

//socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);

const config = require('./webpack.config');
const compiler = webpack(config);
const PORT = process.env.PORT || 3000;

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  stats: { colors: true },
  publicPath: config.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler));

// socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newUser', (id, callback) => {
    socket.broadcast.emit('userJoin', id);
    callback(true);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
})

http.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
