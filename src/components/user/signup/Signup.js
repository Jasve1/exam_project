import React, { Component } from 'react'
import formObject from '../../../utils/formObject';

export class Signup extends Component {
    handleSubmit = (e) => {
        e.preventDefault();

        const user = formObject.createObject(e);

        this.props.signup(
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
                    <button type="submit">Sign up</button>
                </form>
            </div>
        )
    }
}

export default Signup
