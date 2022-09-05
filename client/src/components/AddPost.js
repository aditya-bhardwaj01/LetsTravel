import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default class AddPost extends Component {
  render() {
    return (
      <div className="AddPost">
        <div className="app-post-btn">
          <button
            type="button"
            className="btn btn-small btn-outline-light"
            data-toggle="modal"
            data-target="#addPost"
          >
            Create post +
          </button>

          <div
            className="modal fade"
            id="addPost"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            style={{ color: "black" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Create your new post
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                    <Formik
                    // initialValues={this.initialValues}
                    // onSubmit={this.onSubmit}
                    // validationSchema={this.validationSchema}
                    >
                        
                    </Formik>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
