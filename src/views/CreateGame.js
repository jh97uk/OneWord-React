/* eslint-disable import/first */

import React, { Component } from 'react';
import '../App.css';
import Ripples from 'react-ripples';
import AppBar from '../widgets/AppBar';
import { Link, BrowserRouter as Router, Redirect } from 'react-router-dom';
import Switch from 'react-switch';
import feathers from '@feathersjs/client';
import { Facebook } from 'react-spinners-css';
import { withAlert } from "react-alert";

class CreateGameView extends Component {
  
  constructor(props) {
    super();

    const socket = props.connection;
    const feathersClient = feathers();
    feathersClient.configure(feathers.socketio(socket));
    
    this.sessions = feathersClient.service('sessions')

    this.state = {createStoryLoading:false, linkOnly: false, storyTitle: '', sessionOwnerId:props.userId};
    this.handleChange = this.handleChange.bind(this);
    this.createGame = this.createGame.bind(this);
  }

  handleChange(linkOnly) {
    this.setState({ linkOnly });
  }

  componentDidMount() {
    var self = this;    
  }

  createGame() {
    this.setState({createStoryLoading:true})
    const self = this;
    this.sessions.create({linkOnly:this.state.linkOnly, storyTitle:this.state.storyTitle, sessionOwnerId:this.state.sessionOwnerId}).then(function(session){
      self.setState({createStoryLoading:true, createdSession: session})
    }, function(error){
      self.props.alert.show(error.message, {
        title:"Uhoh, something went wrong...", 
        closeCopy:'Ok',
        onClose:function(){
          self.setState({createStoryLoading:false});
        }})
    });
  }

  render() {
    if (this.state.createdSession) {
      return <Redirect to={"/story/" + this.state.createdSession.id} />
    }

    let loadingButton;
    if(this.state.loading){
      loadingButton = (<Facebook color={'black'}></Facebook>);
    } else{
        loadingButton = (
            <Ripples color="#9e9e9e" className="fullWidth"><button onClick={this.createGame} className="button primary"
                            style={{
                                width:'100%',
                                height:'40px',
                                border:'0px',
                                borderRadius:'6px',
                                fontSize:'18px',
                                fontWeight:'500'
                            }}>CREATE</button></Ripples>
        )
    }

    return (
      <div>
        <AppBar pageTitle="CREATE A GAME" backRoute="/"></AppBar>

        <div className="centeredContainer">
          <input placeholder="PROMPT TITLE" type="text" onChange={event => this.setState({ storyTitle: event.target.value })}></input>
          <ul>
            <li>
              <label>LINK ONLY</label>
              <Switch onChange={this.handleChange} checked={this.state.linkOnly}></Switch>
            </li>
            <li>
              {loadingButton}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withAlert()(CreateGameView);
