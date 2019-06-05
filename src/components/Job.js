import React, { Component } from 'react'

export class Job extends Component {
    render() {
        let job = this.props.job;

        if(!job){
          return  <p>Job loading...</p>
        }

        return (
            <div>
               <header>
                   <h1>{job.title}</h1>
               </header> 
            </div>
        )
    }
}

export default Job
