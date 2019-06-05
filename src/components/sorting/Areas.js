import React, { Component } from 'react'
import { Link } from "react-router-dom";

export class Areas extends Component {

    sorting = (list, factor) => {
        return list.filter(elm => elm.area.path_name === factor)
    }

    render() {
        let areas = this.props.areas;
        let jobs = this.props.jobs;

        if(areas.length <= 0){
            return  <p>Categories loading...</p>
        }

        let filteredJobs = jobs.filter(job => job.category.path_name === this.props.category);

        if(filteredJobs.length <= 0){
            return <p>No jobs in this category</p>
        }

        return (
            <ul>
                {areas.map(elm => (
                    <Link to={`/jobs/${this.props.category}/${elm.path_name}`} key={elm._id}>
                        <li>
                            <p>{elm.name} ({this.sorting(filteredJobs, elm.path_name).length})</p>
                        </li>
                    </Link>
                ))}  
            </ul>
        )
    }
}

export default Areas
