import React, { Component } from 'react'

export class Login extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        
        const user = {};
        e.target.childNodes.forEach((elm) => {
          if(elm.value){
            user[elm.name] = elm.value
          }
          elm.value = null
        });
    
        this.props.login(
            user.username,
            user.password
        )
        .then(() => {
            this.props.history.push('/company');
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="username" placeholder="Your Username" required/>
                    <input type="password" name="password" placeholder="Password" required/>
                    <button type="submit">Login</button>
                    <p>{this.props.loginStatus}</p>
                </form>
            </div>
        )
    }
}

export default Login
