/* eslint-disable import/first */

import Cookies from 'universal-cookie';
import React, {Component} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Theme from './Theme.js'
import Logo from './widgets/logo';
import Ripples from 'react-ripples';
import CreateGameView from './views/CreateGame';
import HomeView from './views/Home';
import StoryChat from './views/StoryChat';
import JoiningStory from './views/JoiningStory';
import InitializeUserView from './views/IntializeUser';
import { nanoid } from 'nanoid';
import { positions, Provider } from "react-alert";
import AlertMUITemplate from "react-alert-template-mui";

import io from 'socket.io-client';
import feathers from '@feathersjs/client';

const socket = io('http://localhost:3030');
const Cookie = new Cookies();
const feathersClient = feathers();
feathersClient.configure(feathers.socketio(socket));
const users = feathersClient.service('users');

class App extends Component{
  constructor(props){
    super();
    let requestedPath = window.location.pathname;
    if(requestedPath == '/user/new'){
      requestedPath = '/'
    }
    this.state = {userId:null, requestedPath:requestedPath}
    this.setUser = this.setUser.bind(this)
  }
  setUser(user){
    this.setState({userId:user.id});
  }

  render(){  
    let redirect = <></>
    if(this.state.userId){
      redirect = <Redirect to={this.state.requestedPath}/>
    } else{
      redirect = <Redirect to={'/user/new'}/>
    }
    
    return (
      <ThemeProvider theme={Theme}>
        <CssBaseline/>
        <Provider template={AlertMUITemplate}>
          <div className="appContainer">
            <Router>
              {redirect}
              <Switch>
              <Route path="/user/new" render={(props)=><InitializeUserView {...props} connection={socket} setUser={this.setUser}/>}/>
              <Route path="/join/random" render={(props)=><JoiningStory {...props} userId={this.state.userId}/>}/>
              <Route path="/story/:storyId" render={(props)=><StoryChat {...props} connection={socket} userId={this.state.userId}/>}/>
                <Route path="/create">
                  <CreateGameView connection={socket} userId={this.state.userId}></CreateGameView>
                </Route>
                <Route path="/">
                  <HomeView></HomeView>
                </Route>
              </Switch>
            </Router>
          </div>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
