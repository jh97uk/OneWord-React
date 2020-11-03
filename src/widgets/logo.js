import React from 'react';
import '../App.css';
import { withTheme } from '@material-ui/core/styles';

function Logo(props) {
  console.log(props);
  return (
    <div className="logo">
        <div className="leftPortion" style={{backgroundColor:'#e0e0e0'}}>
          <h1>O</h1>
        </div>
        <div className="rightPortion" style={{backgroundColor:props.theme.palette.secondary.main}}>
          <h1>W</h1>
        </div>
    </div>
  );
}

export default withTheme(Logo);
