import React, { Component } from 'react'

import JobSuggestions from './Jobsuggestions';

export class Job extends Component {
    render() {
        let job = this.props.job;
        let jobs = this.props.jobs;

        if(!job){
          return  <p>Job loading...</p>
        }

        let userJobs = jobs.filter(j => j.user._id === job.user._id && j._id !== job._id)

        return (
            <article>
               <header>
                   <h2>{job.title}</h2>
                   <h5>By {job.user.username}</h5>
               </header> 
               <main>
                   <p>{job.description}</p>
                   <JobSuggestions user={job.user} userJobs={userJobs}/>
               </main>
            </article>
        )
    }
}

export default Job
