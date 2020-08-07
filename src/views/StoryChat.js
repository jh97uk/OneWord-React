/* eslint-disable import/first */
import React, {Component, Fragment, useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { withAlert } from "react-alert";
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import AppBar from '../widgets/AppBar';
import Word from '../widgets/Word';
import {Redirect} from 'react-router-dom';
import feathers from '@feathersjs/client';
import OneLib from '../OneLib.js';

class StoryChat extends Component{
  constructor(props){
    super()
    const socket = props.connection;
    const feathersClient = feathers();
    feathersClient.configure(feathers.socketio(socket));
    if(!props.userId){
      return;
    }
    this.messages = feathersClient.service('messages')
    this.session = feathersClient.service("sessions");
    this.state={exit:false, messages:[], storyTitle:'', typingUser:{id:0, typing:false}, session:{playersInSessionIds:{}}, currentTurnUserId:0};
    this.addWord = this.addWord.bind(this);
    this.onWordFieldChange = this.onWordFieldChange.bind(this);
    this.onEnterPressed = this.onEnterPressed.bind(this);
    this.isItMyTurn = this.isItMyTurn.bind(this);
    this.getPlayerIndex = this.getPlayerIndex.bind(this);
    this.onSessionChangedListener = this.onSessionChangedListener.bind(this);
    this.onPlayerJoinedListener = this.onPlayerJoinedListener.bind(this);
    this.onPlayerLeftListener = this.onPlayerLeftListener.bind(this);
    this.onLeaveGameButtonPressed = this.onLeaveGameButtonPressed.bind(this);
    this.updatePlayerTurn = this.updatePlayerTurn.bind(this);
    this.onWordCreated = this.onWordCreated.bind(this);
    this.joinStory = this.joinStory.bind(this);
    this.initiateTypingTimeout = this.initiateTypingTimeout.bind(this);
    this.setPlayerTyping = this.setPlayerTyping.bind(this);
    this.messages.on('created', this.onWordCreated);
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
    console.log("patched")
    console.log(data);
    this.setState({session:data});
  }

  onPlayerJoinedListener = function(data){
    if(data.userId == this.props.userId)
      return
    toast.dark(data.newPlayer+" has joined the story");
  }

  onPlayerLeftListener = function(player){
    if(player.leftPlayerId == this.props.userId)
      return
    const updatedSession = this.state.session;
    delete updatedSession.playersInSessionIds[player.leftPlayerId];
    this.setState({session:updatedSession});
    this.updatePlayerTurn();

    toast.dark(player.leftPlayerName+" has left the story");
  }
  updatePlayerTurn(){
    const self = this;
    Object.keys(self.state.session.playersInSessionIds).forEach(function(key, index){
      if(self.state.messages[self.state.messages.length-1] != undefined && (self.state.messages[self.state.messages.length-1].authorId != null && self.state.messages[self.state.messages.length-1].authorId != undefined) && key == self.state.messages[self.state.messages.length-1].authorId){
        if(Object.keys(self.state.session.playersInSessionIds).length > index+1 && self.state.session.playersInSessionIds[key] != null){
          self.setState({currentTurnUserId:index+1});
        } else{
          self.setState({currentTurnUserId:0});
        }
      }
    });
  }

  onWordCreated(word){
    word.playerIndex = this.getPlayerIndex(word.authorId);
    this.setState({
      messages:this.state.messages.concat(word)
    })
    this.updatePlayerTurn();
  }

  joinStory(storyId){
    const self = this;
    let playerSession = {};
    playerSession[self.props.userId] = {typing:false}
    this.session.patch(self.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession}).then(function(data){
      self.setState({session:data});
      self.messages.get(self.props.location.pathname.split("/")[2]).then(function(data){
        self.setState({messages:data})
      });
    }, function(error){
      OneLib.showError(self.props.alert, error, function(){
        self.setState({exit:true});
      })
    });

    self.session.on('patched', self.onSessionChangedListener);
    self.session.on("joined", self.onPlayerJoinedListener);
    self.session.on('left', self.onPlayerLeftListener);
  }

  componentDidMount(){
    if(!this.props.userId){
      return false;
    }
    const self = this;
    const storyId = this.props.location.pathname.split("/")[2];

    this.session.get(storyId, function(){
    }).then(function(story){
      self.joinStory(storyId)
      self.setState({storyTitle:story.name})
    }, function(error){
      OneLib.showError(self.props.alert, error, function(){
        self.setState({exit:true});
      })
    });
  } 

  componentWillUnmount(){
    if(!this.props.userId){
      return false;
    }

    this.session.removeListener("joined", this.onPlayerJoinedListener);
    this.session.removeListener("patched", this.onSessionChangedListener);
    this.session.removeListener('left', this.onPlayerLeftListener);

    if(this.state.session.playersInSessionIds[this.props.userId] === undefined){
      return false;
    }

    let playerSession = {};
    playerSession[this.props.userId] = null
    this.session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
  }

  initiateTypingTimeout(playerSession){
    clearInterval(this.typingInterval);
      this.typingInterval = setInterval(()=>{
        playerSession[this.props.userId] = {typing:false}
        this.session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
        clearInterval(this.typingInterval);
      }, 1000);
  }

  setPlayerTyping(status){
    let playerSession = {}
    if(status){
      playerSession[this.props.userId] = {typing:true}
      this.session.patch(this.props.location.pathname.split("/")[2], {playersInSessionIds:playerSession});
      this.initiateTypingTimeout(playerSession);
    } else{
      this.initiateTypingTimeout(playerSession);
    }
  }

  onWordFieldChange(text){
    const dateNow = Date.now();
    const dateDiff = dateNow-this.state.lastKeyStroke;
    
    if(this.state.lastKeyStroke == null || dateDiff >= 1000){
      this.setPlayerTyping(true);
    } else{
      this.setPlayerTyping(false); 
    }

    this.setState({sendWord:text, lastKeyStroke:Date.now()})
  }

  addWord(word) {
    var self = this;
    this.messages.create({
      text:word,
      storyId:this.props.location.pathname.split("/")[2],
      userId:this.props.userId
    }).then(function(data){
    }, function(error){
      OneLib.showError(self.props.alert, error, function(){
        self.setState({exit:true});
      })
    })
    this.setState({sendWord:''});
  }

  onEnterPressed(event){
    if(event.key == "Enter"){
      if(this.isItMyTurn())
        this.addWord(this.state.sendWord)
    } else if(event.keyCode == 32){
      event.preventDefault();
    }
  }

  isItMyTurn(){
    let userIndex;
    const self = this;
    Object.keys(this.state.session.playersInSessionIds).forEach(function(key, index){
      if(key == self.props.userId && self.state.session.playersInSessionIds[key] != null)
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

    if(!this.props.userId){
      return false;
    }
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
                return <Word word={value.text} key={index} userColor={playerColors[value.playerIndex]}/>
            })}

            {Object.keys(this.state.session.playersInSessionIds).map((key, index)=>{
                if(this.state.session.playersInSessionIds[key] != null && this.props.userId != key){
                  return <Word word="" key={index} typing={this.state.session.playersInSessionIds[key].typing} userColor={playerColors[index]} hidden={!this.state.session.playersInSessionIds[key].typing}/>
                } 
            })}

          {typingElement}
        </div>

        <div className="messageBar">
          <input ref={(input)=>{this.wordInput = input}} placeholder="WORD" disabled={!this.isItMyTurn()} type="text" value={this.state.sendWord || ""} onChange={event=>this.onWordFieldChange(event.target.value)} onKeyDown={this.onEnterPressed}></input>
          <button onClick={()=>this.addWord(this.state.sendWord)} disabled={!this.isItMyTurn()}>SEND</button>
        </div>
        
      </div>
    );
  }
}

export default withAlert()(StoryChat);
