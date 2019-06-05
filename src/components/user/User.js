import React, { Component } from 'react'

import Login from './login/Login';
import Signup from './signup/Signup';
import AddJob from './jobPostings/AddJob';
import JobPostings from './jobPostings/JobPostings'; 

export class User extends Component {
    render() {
        return (
            <div>
                <header>
                    {
                        this.props.isLoggedIn ? <h2>Hello {this.props.user.username}</h2>:
                        <h2>Hello, to post jobs you need to login or sign up</h2>
                    }
                </header>
                <div>
                   {
                        this.props.isLoggedIn ? 
                        <div>
                            <JobPostings userJobs={this.props.user.jobPostings} />
                            <AddJob 
                                submitJob={this.props.submitJob} 
                                userId={this.props.user._id} 
                                linkJobToUser={this.props.linkJobToUser}
                                categories={this.props.categories}
                                areas={this.props.areas}
                            />
                            <button onClick={this.props.logout}>Log out</button> 
                        </div>
                         :
                        <div>
                            <article>
                                <header>
                                    <h3>Login</h3>
                                </header>
                                <Login login={this.props.login} loginStatus={this.props.loginStatus}/>
                            </article>
                            <p>or</p>
                            <article>
                                <header>
                                    <h3>Sign up</h3>
                                </header>
                                <Signup signup={this.props.signUp}/>
                            </article>
                        </div>
                    } 
                </div>
            </div>
        )
    }
}

export default User
