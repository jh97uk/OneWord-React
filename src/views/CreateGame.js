import React, {Component} from 'react';
import '../App.css';
import Ripples from 'react-ripples';
import AppBar from '../widgets/AppBar';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import Switch from 'react-switch';

class CreateGameView extends Component{
  constructor(){
    super();
    this.state = {checked:false, storyTitle:''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
  }

  render(){
    return(
      <div>
          <AppBar pageTitle="CREATE A GAME" backRoute="/"></AppBar>

          <div className="centeredContainer">
            <input placeholder="PROMPT TITLE" type="text" onChangeText={text=>this.setState({storyTitle:text})}></input>

            <ul>
                <li>
                  <label>LINK ONLY</label>
                  <Switch onChange={this.handleChange} checked={this.state.checked}></Switch>
                </li>
                <li>
                  <Ripples color="#9e9e9e" className="fullWidth"><Link to={{pathname:'/story/qwdpokqpwodkqwpk', storyTitle:'asdw'}}  className="button primary">CREATE</Link></Ripples>
                </li>
          </ul>
          </div>
      </div>
    );
  }
}

export default CreateGameView;
