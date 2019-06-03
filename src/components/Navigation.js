import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class Navigation extends Component {
    render() {
        let list = [];
        let navigation = this.props.navigation;

        navigation.forEach(elm => {
            list.push(
                <Link to={elm.path}>
                    <li>
                        <p>{elm.name}</p>
                    </li>
                </Link>
            )
        });

        return (
            <nav>
               <ul>
                   {list}
               </ul>
            </nav>
        )
    }
}

export default Navigation
