import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import '../styles/App.scss';

import AuthService from './login/AuthService';
import Login from './login/Login';
import Signup from './signup/Signup';

export class App extends Component {
  LOCAL_URL = 'http://localhost:8080';

  constructor(props) {
    super(props);

    this.Auth = new AuthService(`${this.LOCAL_URL}/api/users/authenticate`);

    this.state = {
      isLoggedIn: false,
      user: {}
    }
  }

  componentDidMount(){
    if(this.Auth.getToken()){
      this.setState({isLoggedIn: true});
      this.getUser(localStorage.getItem('userId'));
    }
  }

  getUser = (userId) => {
    this.Auth.fetch(`${this.LOCAL_URL}/api/user/${userId}`)
    .then(json => {
      this.setState({user: json})
    })
  }

  signUp = (username, password) => {
    return new Promise((res, rej) => {
      if(username && password){
        this.Auth.fetch(`${this.LOCAL_URL}/api/users/signUp`, {
          method: 'post',
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
        .then(json => {
          this.login(json.username, password);
        })
      }else{
        rej('Username or password missing')
      }
    })
  }

  login = (username, password) => {
    return new Promise((res, rej) => {
      if(username && password){
        this.Auth.login(
          username,
          password
        ).then((res) => {
            console.log(`${res.user.username} is logged in`);
            this.getUser(localStorage.getItem('userId'));
            this.setState({isLoggedIn: true});
        });
      } else{
        rej('Username or password missing')
      }
    })
  }

  logout = () => {
    this.Auth.logout();
    this.setState({isLoggedIn: false});
  }

  render() {
    return (
      <Router>
        <header>
          {
            this.state.isLoggedIn ? <h1>Hello {this.state.user.username}</h1>:
            <h1>Hello, please login</h1>
          }
          <nav>
            {
              this.state.isLoggedIn ? <button onClick={this.logout}>Log out</button> :
              <Link to='/login'>Login</Link>
            }
          </nav>
        </header>
        <main>
          <Switch>
            <Route exact path={'/login'}
              render={(props) =>
                this.state.isLoggedIn ? props.history.push('/'):
                <div>
                  <Login {...props} login={this.login}/>
                  <p>or</p>
                  <Signup {...props} signup={this.signUp}/>
                </div>
              }
            />
          </Switch>
        </main>
      </Router>
    )
  }
}

export default App