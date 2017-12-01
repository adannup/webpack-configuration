import React, { Component } from 'react';
import Header from './Header';
import io from 'socket.io-client';

const socket = io();

class App extends Component {
  componentDidMount() {
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('newUser', socket.id, (data) => {
        if(data){
          console.log('Servidor recibio las credenciales exitosamente');
        }
      });
    });

    socket.on('userJoin', (id) => {
      console.log(`A new user has been joined ${id}`);
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  render() {
    return (
      <div>
        <Header title="Webpack Configuration" />
        <p>Webpack + ReactJS</p>
      </div>
    )
  }
}

export default App;
