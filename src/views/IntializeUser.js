import React, { Component } from 'react';
import '../App.css';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import Logo from '../widgets/logo';
import Ripples from 'react-ripples';
import { withAlert } from "react-alert";
import feathers from '@feathersjs/client';
import { Facebook } from 'react-spinners-css';
import OneLib from '../OneLib.js';

class InitializeUserView extends Component{
    constructor(props){
        super();
        this.state = {loading:false}
        this.createUser = this.createUser.bind(this);
        const socket = props.connection;
        const feathersClient = feathers();
        feathersClient.configure(feathers.socketio(socket));

        this.users = feathersClient.service('users');
    }

    createUser(){
        this.setState({loading:true})
        const self = this;
        this.users.create({name:this.state.username}).then(function(user){
            self.setState({loading:false})
            self.props.setUser(user);
        }, function(error){
            OneLib.showError(self.props.alert, error, function(){})
            self.setState({loading:false});
        });
    }

    render(){
        let loadingButton;
        if(this.state.loading){
            loadingButton = (<Facebook color={'black'}></Facebook>);
        } else{
            loadingButton = (
                <Ripples color="#9e9e9e" className="fullWidth"><button onClick={this.createUser} className="button primary"
                                style={{
                                    width:'100%',
                                    height:'40px',
                                    border:'0px',
                                    borderRadius:'6px',
                                    fontSize:'18px',
                                    fontWeight:'500'
                                }}>START</button></Ripples>
            )
        }
        return (
            <div>
              <Logo></Logo>
                <ul className="mainMenuButtons">
                    <li>
                        <input placeholder="USERNAME" type="text" onChange={event => this.setState({ username: event.target.value })} style={{
                            width:'calc(100% - 35px)',
                            height:'40px',
                            fontSize:'25px',
                            padding:'10px'
                        }}></input>
                    </li>
                    <li style={{
                        display:'inline-block',
                        width:'100%',
                        textAlign:'center'
                    }}>
                        {loadingButton}
                    </li>
                </ul>
            </div>
          );
    }
}

export default withAlert()(InitializeUserView);