import React, { Component } from 'react'

export class Signup extends Component {
    handleSubmit = (e) => {
        e.preventDefault();

        const user = {};
        e.target.childNodes.forEach((elm) => {
          if(elm.value){
            user[elm.name] = elm.value
          }
          elm.value = null
        });

        this.props.signup(
            user.username,
            user.password
        )
        .then(() => {
           this.props.history.push('/'); 
        })
        
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="username" placeholder="Your Username" required/>
                    <input type="password" name="password" placeholder="Password" required/>
                    <button type="submit">Sign up</button>
                </form>
            </div>
        )
    }
}

export default Signup
