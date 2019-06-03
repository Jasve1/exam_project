import React, { Component } from 'react'

export class AddJob extends Component {
    handleSubmit = (e) => {
        e.preventDefault();

        const job = {};
        e.target.childNodes.forEach((elm) => {
          if(elm.value){
            job[elm.name] = elm.value
          }
          elm.value = null
        });

        this.props.submitJob(
            job.title,
            job.category,
            job.area,
            job.description,
            this.props.userId
        )
        .then((res) => {
            this.props.linkJobToUser(
                res._id,
                this.props.userId
            )
        })
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="title" placeholder="Add a title" required/>
                    <input type="text" name="category" placeholder="Add a category" required/>
                    <input type="text" name="area" placeholder="Add an area" required/>
                    <textarea type="text" name="description" placeholder="Add a description" required/>
                    <button type="submit">Add a job post</button>
                </form>
            </div>
        )
    }
}

export default AddJob
