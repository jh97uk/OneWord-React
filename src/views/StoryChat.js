/* eslint-disable import/first */

import Cookies from 'universal-cookie';
import React, {Component, Fragment, useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { withAlert } from "react-alert";
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import Ripples from 'react-ripples';
import AppBar from '../widgets/AppBar';
import Word from '../widgets/Word';
import {Redirect} from 'react-router-dom';
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
    this.state={exit:false, messages:[], storyTitle:'', typingUser:{id:0, typing:false}, session:{playersInSessionIds:{}}, currentTurnUserId:0};
    this.addWord = this.addWord.bind(this);
    this.onWordFieldChange = this.onWordFieldChange.bind(this);
    this.onEnterPressed = this.onEnterPressed.bind(this);
    this.isItMyturn = this.isItMyturn.bind(this);
    this.getPlayerIndex = this.getPlayerIndex.bind(this);
    this.onSessionChangedListener = this.onSessionChangedListener.bind(this);
    this.onPlayerJoinedListener = this.onPlayerJoinedListener.bind(this);
    this.onPlayerLeftListener = this.onPlayerLeftListener.bind(this);
    this.onLeaveGameButtonPressed = this.onLeaveGameButtonPressed.bind(this);
  }

  onLeaveGameButtonPressed(){
    const self = this;
    this.props.alert.close = function(){
      alert();
    }
    this.props.alert.show("Leaving the story will stop it.", 
    {
      title:"Are you sure you want to close the story?", 
      actions:[
        {
          copy:"Leave",
          onClick:function(){
            self.setState({exit:true})
          }
        }
        
      ],
    });
  }

  onSessionChangedListener = function(data){
    this.setState({session:data});
  }

  onPlayerJoinedListener = function(data){
    if(data.newPlayer == Cookie.get('userId'))
      return
    toast.dark(data.newPlayer+" has joined the story");
  }

  onPlayerLeftListener = function(data){
    if(data.newPlayer == Cookie.get('userId'))
      return
      toast.dark(data.leftPlayer+" has left the story");
  }

  componentDidMount(){
    var self = this;
    messages.on('created', function(message){
      self.setState({
        messages:self.state.messages.concat(message)
      })
      console.log("testing");

      Object.keys(self.state.session.playersInSessionIds).forEach(function(key, index){
        console.log("test");
        if((self.state.messages[self.state.messages.length-1].authorId != null && self.state.messages[self.state.messages.length-1].authorId != undefined) && key == self.state.messages[self.state.messages.length-1].authorId){
          if(Object.keys(self.state.session.playersInSessionIds).length > index+1){
            self.setState({currentTurnUserId:index+1});
          } else{
            self.setState({currentTurnUserId:0});
          }
        }
      });
    });

    session.get(this.props.location.pathname.split("/")[2], function(){
    }).then(function(data){
      if(data.code==404){
        self.props.alert.show("This game doesn't exist", {
        title:"Game not found", 
        closeCopy:'Ok',
        onClose:function(){
          self.setState({exit:true});
        }})
      } else{
        let playerSession = {};
        playerSession[Cookie.get('userId')] = {typing:false}
        session.patch(self.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession}).then(function(data){
        });
        session.on('patched', self.onSessionChangedListener);
        session.on("joined", self.onPlayerJoinedListener);
        session.on('left', self.onPlayerLeftListener);
        self.setState({storyTitle:data.name})
      }
    });
    
  } 

  componentWillUnmount(){
    session.removeListener("joined", this.onPlayerJoinedListener);
    session.removeListener("patched", this.onSessionChangedListener);
    session.removeListener('left', this.onPlayerLeftListener);

    let playerSession = {};
    playerSession[Cookie.get('userId')] = null
    session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
  }

  onWordFieldChange(text){
    const dateNow = Date.now();
    const dateDiff = dateNow-this.state.lastKeyStroke;
    let playerSession = {}
    if(this.state.lastKeyStroke == null || dateDiff >= 1000){
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
    if(userIndex == this.state.currentTurnUserId)
      this.wordInput.focus();
    return userIndex == this.state.currentTurnUserId;
  }

  getPlayerIndex(id){
    let colorIndex = 0;
    Object.keys(this.state.session.playersInSessionIds).forEach(function(key, index){
      if(key == id){
        colorIndex = index;
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
        if(self.state.session.playersInSessionIds[key] != null && self.state.session.playersInSessionIds[key].typing){
          return true;
        }
      });
    }
    if (this.state.exit) {
      return <Redirect to={"/create"}/>
    }
    return(
      <div style={{display:'flex', width:'100%', height:'100%', flexDirection:'column'}}>
        <AppBar pageTitle={this.state.storyTitle} backRoute="/create" onBackButtonFunction={this.onLeaveGameButtonPressed}></AppBar>
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
                if(this.state.session.playersInSessionIds[key] != null && Cookie.get('userId') != key){
                  return <Word word="" key={index} typing={this.state.session.playersInSessionIds[key].typing} userColor={playerColors[index]} hidden={!this.state.session.playersInSessionIds[key].typing}/>
                } 
            })}

          {typingElement}
        </div>

        <div className="messageBar">
          <input ref={(input)=>{this.wordInput = input}} placeholder="WORD" disabled={!this.isItMyturn()} type="text" value={this.state.sendWord || ""} onChange={event=>this.onWordFieldChange(event.target.value)} onKeyDown={this.onEnterPressed}></input>
          <button onClick={()=>this.addWord(this.state.sendWord)} disabled={!this.isItMyturn()}>SEND</button>
        </div>
        
      </div>
    );
  }
}

export default withAlert()(StoryChat);
