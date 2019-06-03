import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class JobPostings extends Component {
    render() {
        let list = [];
        let jobPostings = this.props.userJobs;

        if(!jobPostings){
            return <p>jobs loading</p>
        }

        jobPostings.forEach(job => {
            list.push(
                <li>
                    <h3>{job.title}</h3>
                    <Link to={`job/${job._id}`}>
                        See job
                    </Link>
                </li>
            )
        })
        return (
            <div>
               {list} 
            </div>
        )
    }
}

export default JobPostings
