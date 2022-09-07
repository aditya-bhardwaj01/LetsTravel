import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { image } from "cloudinary-react";
import axios, { AxiosError } from "axios";
import dropimage from "../images/drop-image.jpg";

export default class AddPost extends Component {
  constructor(props){
    super(props);
    this.state ={
      postImage: "",
      postImageSelected: ""
    }
  }

  initialValues = {
    postImage: "",
    posttitle: "",
    posttext: "",
    postlocation: ""
  }

  validationSchema = Yup.object().shape({
    //postImage: Yup.mixed().required("A file is required"),
    posttitle: Yup.string().required("Required field"),
    posttext: Yup.string().required("Required field"),
    postlocation: Yup.string().required("Required field")
  })

  onSubmit = (data) => {
    console.log(123)
  }

  render() {
    return (
      <div className="AddPost">
        <div className="app-post-btn">
          <button
            type="button"
            className="btn btn-small btn-outline-light"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
          >
            Create post +
          </button>

          <div
            className="modal fade bd-example-modal-lg"
            id="addPost"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            //style={{ color: "black" }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel" style={{color: "black"}}>
                    Share your experience!
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
                    initialValues={this.initialValues}
                    onSubmit={this.onSubmit}
                    validationSchema={this.validationSchema}
                  >
                    <Form className="add-post-form">

                      <div className="post-image-section" style={{textAlign: "center"}}>
                        <div className="post-image-display" >
                          <img
                            src={this.state.postImage === "" ? dropimage : this.state.postImage}
                            id="output"
                            width="200"
                            height="200"
                            className="img-fluid"
                          />
                        </div>
                        <div className="post-image-input" style={{marginTop: "10px"}}>
                          <Field
                            name="postImage"
                            id="postImage"
                            accept="image/*"
                            type="file"
                            onChange={(event) => {
                              const [file] = event.target.files;
                              this.setState({
                                postImageSelected: event.target.files[0],
                                postImage: URL.createObjectURL(file)
                              });
                            }}
                            required
                          />
                          <p>
                            <label
                              className="btn btn-info" 
                              htmlFor="postImage"
                            >
                              Add picture
                            </label>
                          </p>
                        </div>
                        <ErrorMessage name="postImage" component="span" />
                      </div>

                      <Field 
                      className="postfield"
                      name="posttitle"
                      id="posttitle"
                      type="text"
                      placeholder="Add title for your post"
                      />
                      <ErrorMessage name="posttitle" component="span" />

                      <Field
                      as="textarea"
                      className="postfield"
                      name="posttext"
                      id="posttext"
                      type="text"
                      placeholder="So how was your trip??"
                      />
                      <ErrorMessage name="posttext" component="span" />

                      <Field
                      className="postfield"
                      name="postlocation"
                      id="postlocation"
                      type="text"
                      placeholder="Give your trip locations seperated by commas"
                      />
                      <ErrorMessage name="postlocation" component="span" />
                      
                    <button type='submit' className="btn btn-success btn-lg btn-block">Create</button>
                    </Form>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
