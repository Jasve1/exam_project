import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import '../styles/App.scss';

import AuthService from '../utils/AuthService';
import Navigation from './Navigation';
import User from './user/User';
import Categories from './sorting/Categories';
import Area from './sorting/Areas';
import JobList from './sorting/JobList';
import Job from './job/Job';

export class App extends Component {
  LOCAL_URL = 'http://localhost:8080';

  constructor(props) {
    super(props);

    this.Auth = new AuthService(`/api/users/authenticate`);

    this.state = {
      isLoggedIn: false,
      loginStatus: '',
      user: {},
      jobs: [],
      categories: [],
      areas: [],
      navigation: [
        {
          path: '/',
          name: 'See Job Postings'
        },
        {
          path: '/company',
          name: 'Post a job'
        }
      ]
    }
  }

  componentDidMount(){
    this.getJobs();
    this.getCategories();
    this.getAreas();
    if(this.Auth.loggedIn()){
      this.setState({isLoggedIn: true});
      this.getUser(localStorage.getItem('userId'));
    }
  }

  getJobs = () => {
    this.Auth.fetch(`/api/jobs`)
    .then(json => {
      this.setState({jobs: json})
      console.log(this.state.jobs)
    })
  }
  getCategories = () => {
    this.Auth.fetch(`/api/categories`)
    .then(json => {
      this.setState({categories: json})
      console.log(this.state.categories)
    })
  }
  getAreas = () => {
    this.Auth.fetch(`/api/areas`)
    .then(json => {
      this.setState({areas: json})
      console.log(this.state.areas)
    })
  }

  getUser = (userId) => {
    this.Auth.fetch(`/api/user/${userId}`)
    .then(json => {
      this.setState({user: json})
    })
  }

  signUp = (username, password) => {
    return new Promise((res, rej) => {
      if(username && password){
        this.Auth.fetch(`/api/users/signUp`, {
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
      this.Auth.fetch(`/api/jobPostings`, {
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
        this.getJobs();
      })
    })
  }
  linkJobToUser = (jobId, userId) => {
    this.Auth.fetch(`/api/user/jobPostings/${userId}`, {
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

  getJobById = (id) => {
    let jobFound = this.state.jobs.find(elm => elm._id === id);
    return jobFound;
  }

  renderJob = (props, id) => {
    let job = this.getJobById(id);
    return <Job {...props}
              job={job}
              jobs={this.state.jobs}
            />
  }

  render() {
    return (
      <Router>
        <header>
          <h1>Find your dream job here!</h1>
          <Navigation navigation={this.state.navigation}/>
        </header>
        <main>
          <Switch>

            <Route exact path={'/'}
              render={(props) => 
                <div>
                  <h2>Choose a category</h2>
                  <Categories {...props} jobs={this.state.jobs} categories={this.state.categories}/>
                </div>
              }
            />

            <Route exact path={'/jobs/:category'}
              render={(props) => 
                <div>
                  <h2>Choose a location</h2>
                  <Area {...props} 
                    jobs={this.state.jobs} 
                    category={props.match.params.category}
                    areas={this.state.areas}
                  />
                </div>
                
              }
            />

            <Route exact path={'/jobs/:category/:area'}
              render={(props) => 
                <JobList {...props} 
                  jobs={this.state.jobs} 
                  category={props.match.params.category}
                  area={props.match.params.area}
                />
              }
            />

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
                  categories={this.state.categories}
                  areas={this.state.areas}
                />
              }
            />

            <Route exact path={'/job/:id'}
              render={(props) =>
                this.renderJob(props, props.match.params.id)
              }
            />

          </Switch>
        </main>
      </Router>
    )
  }
}

export default App