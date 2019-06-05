import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class Categories extends Component {
    render() {
        let categories = this.props.categories;

        if(categories.length <= 0){
          return  <p>Categories loading...</p>
        }

        return (
            <ul>
               {categories.map(elm => (
                    <Link to={`/jobs/${elm.name}`} key={elm._id}>
                        <li>
                            <p>{elm.name}</p>
                        </li>
                    </Link>
                ))} 
            </ul>
        )
    }
}

export default Categories
