import React, {Component} from 'react';
import '../App.css';
import {Link, BrowserRouter as Router, Redirect} from 'react-router-dom';
import ReactLoading from 'react-loading';
import Ripples from 'react-ripples';
import Logo from '../widgets/logo';
import { withAlert } from "react-alert";
import OneLib from '../OneLib';

class JoiningStory extends React.Component{
  constructor(props){
    super();
    this.state = {
      exit:false,
      gameIdFound:null,
    }
  }
  componentDidMount(){
    if(!this.props.userId)
      return;
    const self = this;
    fetch('http://localhost:3030/sessions', {mode:'cors'}).then(response=>response.json()).then(data=>{
      if(data.code != undefined && data.code == 500){
        OneLib.showError(self.props.alert, data, function(){
          self.setState({exit:true});
        })
      } else{
        self.setState({gameIdFound:data.id});
      }
    });
  }
  render(props){
    if(this.state.gameIdFound != null){
      return <Redirect to={"/story/" + this.state.gameIdFound} />
    } else if(this.state.exit){
      return <Redirect to={"/"} />
    }
    return(
      <div>
            <Logo></Logo>
            <h3 className="statusMessage">Finding story...</h3>
            <div style={{height:'80px', width:'80px', margin:'0px auto', marginTop:'20px'}}>
                <ReactLoading type="bubbles" color="#000" height={80} width={80}></ReactLoading>
            </div>
            <ul className="mainMenuButtons">
              <li>
               <Ripples color="#9e9e9e"><Link to="/" className="button primary">CANCEL</Link></Ripples>
              </li>
            </ul>
          
      </div>
    );
  }
}

export default withAlert()(JoiningStory);
