import './App.css';
import React, {Component} from "react"
import {BrowserRouter, Route, Switch} from "react-router-dom";
import JoinRoom from "./JoinRoom/JoinRoom"
import Blackjack from './Blackjack/Blackjack';

class App extends Component {

  render(){
    return (
      <div>
        <BrowserRouter>
          <React.Fragment>
            <Switch>
              <Route path="/" exact component={JoinRoom}/>
              <Route path="/game/:id" exact component={Blackjack}/>
            </Switch>
          </React.Fragment>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
