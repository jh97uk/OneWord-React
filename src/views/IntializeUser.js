import React, { Component } from 'react';
import '../App.css';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import Logo from '../widgets/logo';
import Ripples from 'react-ripples';
import Cookies from 'universal-cookie';
import feathers from '@feathersjs/client';

class InitializeUserView extends Component{
    constructor(props){
        super();
        this.createUser = this.createUser.bind(this);
        const socket = props.connection;
        const feathersClient = feathers();

        feathersClient.configure(feathers.socketio(socket));

        this.users = feathersClient.service('users');
    }

    createUser(){
        const self = this;
        this.users.create({name:this.state.username})
        this.users.on('created', function(user){
            self.props.setUser(user);
        })
    }

    render(){
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
                    <li>
                        <Ripples color="#9e9e9e" className="fullWidth"><button onClick={this.createUser} className="button primary"
                            style={{
                                width:'100%',
                                height:'40px',
                                border:'0px',
                                borderRadius:'6px',
                                fontSize:'18px',
                                fontWeight:'500'
                            }}>START</button></Ripples>
                    </li>
                </ul>
            </div>
          );
    }
}

export default InitializeUserView;