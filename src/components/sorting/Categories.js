import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class Categories extends Component {

    sorting = (list, factor) => {
        return list.filter(elm => elm.category.path_name === factor)
    }

    render() {
        let categories = this.props.categories;
        let jobs = this.props.jobs;

        if(categories.length <= 0){
          return  <p>Categories loading...</p>
        }

        return (
            <ul>
               {categories.map(elm => (
                    <Link to={`/jobs/${elm.path_name}`} key={elm._id}>
                        <li>
                            <p>{elm.name} ({this.sorting(jobs, elm.path_name).length})</p>
                        </li>
                    </Link>
                ))} 
            </ul>
        )
    }
}

export default Categories
