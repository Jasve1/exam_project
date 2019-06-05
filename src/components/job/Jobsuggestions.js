import React, { Component } from 'react'
import {Link} from "react-router-dom";

export class Jobsuggestions extends Component {
    render() {
        const userJobs = this.props.userJobs;
        const user = this.props.user;

        if(userJobs <= 0){
            return <h3>There are no other job offers from {user.username}</h3>
        }

        return (
            <section>
                <h3>See other job offers by {user.username}:</h3>
                <ul>
                    {userJobs.map(job => (
                        <li key={job._id}>
                            <h4>{job.title}</h4>
                            <Link to={`${job._id}`}>
                                See job
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        )
    }
}

export default Jobsuggestions
