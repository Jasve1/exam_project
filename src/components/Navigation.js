import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class Navigation extends Component {
    render() {
        let navigation = this.props.navigation;

        return (
            <ul>
                {navigation.map(elm => (
                    <Link to={elm.path}>
                        <li>
                            <p>{elm.name}</p>
                        </li>
                    </Link>
                ))}  
            </ul>
        )
    }
}

export default Navigation
