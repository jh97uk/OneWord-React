/* eslint-disable import/first */
import Cookies from 'universal-cookie';
import React, {Component} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Ripples from 'react-ripples';
import AppBar from '../widgets/AppBar';
import Word from '../widgets/Word';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {nanoid} from 'nanoid';

import io from 'socket.io-client';
import feathers from '@feathersjs/client';
const socket = io('http://192.168.0.15:3030');
const Cookie = new Cookies();


const feathersClient = feathers();
feathersClient.configure(feathers.socketio(socket));
const messages = feathersClient.service('messages')
const session = feathersClient.service("sessions");

class StoryChat extends Component{
  constructor(){
    super()
    this.state={messages:[], storyTitle:'', typingUser:{id:0, typing:false}, session:{playersInSessionIds:{}}, currentTurnUserId:0};
    this.addWord = this.addWord.bind(this);
    this.onWordFieldChange = this.onWordFieldChange.bind(this);
    this.onEnterPressed = this.onEnterPressed.bind(this);
    this.isItMyturn = this.isItMyturn.bind(this);
    this.getPlayerIndex = this.getPlayerIndex.bind(this);
    this.onSessionChangedListener = this.onSessionChangedListener.bind(this);
    this.onPlayerJoinedListener = this.onPlayerJoinedListener.bind(this);
  }

  onSessionChangedListener(data){
    this.setState({session:data});
  }

  onPlayerJoinedListener = function(data){
    if(data.newPlayer == Cookie.get('userId'))
      return
    toast.dark(data.newPlayer);
  }

  componentDidMount(){
    var self = this;
    messages.on('created', function(message){
      self.setState({
        messages:self.state.messages.concat(message)
      })

      Object.keys(self.state.session.playersInSessionIds).forEach(function(key, index){
        if(key == self.state.messages[self.state.messages.length-1].authorId){
          console.log(Object.keys(self.state.session.playersInSessionIds).length)
          if(Object.keys(self.state.session.playersInSessionIds).length > index+1){
            self.setState({currentTurnUserId:index+1});
          } else{
            self.setState({currentTurnUserId:0});
          }
        }
      });
    });

    const test = session.get(this.props.location.pathname.split("/")[2], function(){
    }).then(function(data){
      self.setState({storyTitle:data.name})
    });
    let playerSession = {};
    playerSession[Cookie.get('userId')] = {typing:false}
    session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
    session.on('patched', this.onSessionChangedListener);
    session.on("joined", this.onPlayerJoinedListener)
  } 

  componentWillUnmount(){
    session.removeListener("joined", this.onPlayerJoinedListener);
    session.removeListener("patched", this.onSessionChangedListener);

    let playerSession = {};
    playerSession[Cookie.get('userId')] = null
    session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
  }

  onWordFieldChange(text){
    const dateNow = Date.now();
    const dateDiff = dateNow-this.state.lastKeyStroke;
    let playerSession = {}
    if(dateDiff >= 1000){
      playerSession[Cookie.get('userId')] = {typing:true}
      session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
      this.typingInterval = setInterval(()=>{
        playerSession[Cookie.get('userId')] = {typing:false}
        session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
        clearInterval(this.typingInterval);
      }, 1000)
    } else{
      clearInterval(this.typingInterval);
      playerSession[Cookie.get('userId')] = {typing:false}
      this.typingInterval = setInterval(()=>{
        session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
        clearInterval(this.typingInterval);
      }, 1000)
    }
    this.setState({sendWord:text, lastKeyStroke:Date.now()})
  }

  addWord(word) {
    messages.create({
      text:word,
      storyId:this.props.location.pathname.split("/")[2],
      userId:Cookie.get("userId")
    });
    this.setState({sendWord:''});
  }

  onEnterPressed(event){
    if(event.key == "Enter"){
      if(this.isItMyturn())
        this.addWord(this.state.sendWord)
    } else if(event.keyCode == 32){
      event.preventDefault();
    }
  }

  isItMyturn(){
    let userIndex;
    Object.keys(this.state.session.playersInSessionIds).forEach(function(key, index){
      if(key == Cookie.get('userId'))
        userIndex = index;
    });
    return userIndex == this.state.currentTurnUserId;
  }

  getPlayerIndex(id){
    let colorIndex = 0;
    Object.keys(this.state.session.playersInSessionIds).forEach(function(key, index){
      if(key == id){
        colorIndex = index;
        console.log(index);
      }
    });
    return colorIndex;
  }
  render(){
    const words = [];
    const playerColors = {0:'#0e1d42', 1:"#76AA72", 2:"#165C6C"}
    let typingElement;
    const self = this;
    if(this.state.session != undefined){      
      Object.keys(this.state.session.playersInSessionIds).forEach(function(key, index){
        if(self.state.session.playersInSessionIds[key].typing){
          return true;
        }
      });
    }

    return(
      <div style={{width:'100%', height:'100%', float:'left'}}>
        <AppBar pageTitle={this.state.storyTitle} backRoute="/create"></AppBar>
        <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}/>
        <div className="fullScreen">
            {this.state.messages.map((value, index)=>{
                return <Word word={value.text} key={index} userColor={playerColors[this.getPlayerIndex(value.authorId)]}/>
            })}

            {Object.keys(this.state.session.playersInSessionIds).map((key, index)=>{
                return <Word word="" key={index} typing={this.state.session.playersInSessionIds[key].typing} userColor={playerColors[index]} hidden={!this.state.session.playersInSessionIds[key].typing}/>
            })}
          {typingElement}
          
          
        </div>
        <div className="messageBar">
          <input placeholder="WORD" disabled={!this.isItMyturn()} type="text" value={this.state.sendWord} onChange={event=>this.onWordFieldChange(event.target.value)} onKeyDown={this.onEnterPressed}></input>
          <button onClick={()=>this.addWord(this.state.sendWord)} disabled={!this.isItMyturn()}>SEND</button>
        </div>
        
      </div>
    );
  }
}

export default StoryChat;
