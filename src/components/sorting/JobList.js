import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class JobList extends Component {
    render() {
        let jobs = this.props.jobs;

        if(jobs.length <= 0){
           return <p>Jobs loading...</p>
        }
        
        let filteredJobs = jobs.filter(job => job.category.name === this.props.category && job.area.name === this.props.area);

        if(filteredJobs.length <= 0){
            return <p>No jobs in this area</p>
        }

        return (
            <ul>
                {filteredJobs.map(elm => (
                        <Link to={`/job/${elm._id}`} key={elm._id}>
                            <li>
                                <p>{elm.title}</p>
                            </li>
                        </Link>
                ))}
            </ul>
        )
        
    }
}

export default JobList
