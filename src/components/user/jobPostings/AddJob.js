import React, { Component } from 'react'

export class AddJob extends Component {
    handleSubmit = (e) => {
        e.preventDefault();

        const job = {};
        e.target.childNodes.forEach((elm) => {
            console.log(elm)
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

    renderElmList = (elmList) => {
        return elmList.map(elm => (
            <option key={elm._id} value={elm._id}>{elm.name}</option>
        ))
    }

    render() {
        let categories = this.props.categories;
        let areas = this.props.areas;

        if(!categories || !areas){
            return <p>Loading categories and areas</p>
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="title" placeholder="Add a title" required/>
                    <select name="area">
                        {this.renderElmList(areas)}
                    </select>
                    <select name="category">
                        {this.renderElmList(categories)}
                    </select>
                    <textarea type="text" name="description" placeholder="Add a description" required/>
                    <button type="submit">Add a job post</button>
                </form>
            </div>
        )
    }
}

export default AddJob
