import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class JobPostings extends Component {
    render() {
        let jobPostings = this.props.userJobs;

        if(!jobPostings){
            return <p>jobs loading</p>
        }

        return (
            <ul>
                {jobPostings.map(job => (
                    <li key={job._id}>
                        <h3>{job.title}</h3>
                        <Link to={`job/${job._id}`}>
                            See job
                        </Link>
                    </li>
                ))}
            </ul>
        )
    }
}

export default JobPostings
