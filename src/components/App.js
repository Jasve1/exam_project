import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import '../styles/App.scss';

import AuthService from './user/login/AuthService';
import Navigation from './Navigation';
import User from './user/User';

export class App extends Component {
  LOCAL_URL = 'http://localhost:8080';

  constructor(props) {
    super(props);

    this.Auth = new AuthService(`${this.LOCAL_URL}/api/users/authenticate`);

    this.state = {
      isLoggedIn: false,
      loginStatus: '',
      user: {},
      jobs: [],
      navigation: [
        {
          path: '/',
          name: 'Home'
        },
        {
          path: '/company',
          name: 'Company'
        }
      ]
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
            password: password,
            jobPostings: []
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

  submitJob = (title, category, area, description, userId) => {
    return new Promise((res, rej) => {
      this.Auth.fetch(`${this.LOCAL_URL}/api/jobPostings`, {
        method: 'post',
        body: JSON.stringify({
          title: title,
          category: category,
          area: area,
          description: description,
          userId: userId
        })
      })
      .then(json => {
        console.log(json);
        res(json);
      })
    })
  }
  linkJobToUser = (jobId, userId) => {
    this.Auth.fetch(`${this.LOCAL_URL}/api/user/jobPostings/${userId}`, {
      method: 'put',
      body: JSON.stringify({
        jobPostings: {_id: jobId}
      })
    })
    .then(json => {
      console.log(json);
      this.getUser(json._id);
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
        })
        .catch(() => {
          this.setState({loginStatus: 'Login failed. Wrong username or password'})
        })
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
          <Navigation navigation={this.state.navigation}/>
        </header>
        <main>
          <Switch>
            <Route exact path={'/company'}
              render={(props) => 
                <User {...props} 
                  isLoggedIn={this.state.isLoggedIn} 
                  user={this.state.user}
                  logout={this.logout}
                  login={this.login}
                  loginStatus={this.state.loginStatus}
                  signUp={this.signUp}
                  submitJob={this.submitJob}
                  linkJobToUser={this.linkJobToUser}
                />
              }
            />
          </Switch>
        </main>
      </Router>
    )
  }
}

export default App