import React, { Component } from 'react';
import '../App.css';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import {Button, TextField} from '@material-ui/core';
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
        return (
            <div>
              <Logo></Logo>
                <ul className="mainMenuButtons">
                    <li>
                        <TextField
                            label="USERNAME"
                            variant="outlined"
                            color="#272c34"
                            onChange={event => this.setState({ username: event.target.value })}
                            style={{
                                width:'100%',
                                height:'40px',
                            }}/>
                    </li>
                    <li style={{
                        display:'inline-block',
                        width:'100%',
                        textAlign:'center',
                        paddingTop:15
                    }}>
                        {this.state.loading ? 
                            <Facebook color={'black'}></Facebook> 
                                :
                            <Button variant="contained" style={{
                                width:'100%',
                                height:'40px',
                                fontWeight:'500'
                                }}
                                onClick={this.createUser}>CREATE USER</Button>
                        }
                    </li>
                </ul>
            </div>
          );
    }
}

export default withAlert()(InitializeUserView);