import React, { Component } from 'react'
import { Link } from "react-router-dom";

export class Areas extends Component {
    render() {
        let areas = this.props.areas;
        let jobs = this.props.jobs;

        if(areas.length <= 0){
            return  <p>Categories loading...</p>
        }

        let filteredJobs = jobs.filter(job => job.category.name === this.props.category);

        if(filteredJobs.length <= 0){
            return <p>No jobs in this category</p>
        }

        return (
            <ul>
                {areas.map(elm => (
                    <Link to={`/jobs/${this.props.category}/${elm.name}`} key={elm._id}>
                        <li>
                            <p>{elm.name}</p>
                        </li>
                    </Link>
                ))}  
            </ul>
        )
    }
}

export default Areas
