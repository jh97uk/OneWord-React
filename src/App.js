import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import Logo from './widgets/logo';
import Ripples from 'react-ripples';
import CreateGameView from './views/CreateGame';
import HomeView from './views/Home';
import StoryChat from './views/StoryChat';


function App() {
  return (
    <div className="appContainer">
      <Router>
        <Switch>
        <Route path="/story/:storyId" render={(props)=><StoryChat test="sda" {...props}/>}/>
          <Route path="/create">
            <CreateGameView></CreateGameView>
          </Route>
          <Route path="/">
            <HomeView></HomeView>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
