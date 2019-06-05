import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class JobList extends Component {
    render() {
        let jobs = this.props.jobs;

        if(jobs.length <= 0){
           return <p>Jobs loading...</p>
        }
        
        let filteredJobs = jobs.filter(job => job.category.path_name === this.props.category && job.area.path_name === this.props.area);

        if(filteredJobs.length <= 0){
            return <p>No jobs in this area</p>
        }

        return (
            <ul>
                {filteredJobs.map(elm => (
                    <li key={elm._id}>
                        <h3>{elm.title}</h3>
                        <Link to={`/job/${elm._id}`}>
                            <p>See more</p>
                        </Link>
                    </li>
                        
                ))}
            </ul>
        )
        
    }
}

export default JobList
