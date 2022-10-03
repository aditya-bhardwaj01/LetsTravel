import React, { Component } from "react";
import Navbar, {NavigateNavbar} from "./Navbar";
import swal from "sweetalert";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import contact from "../images/contact.gif";
import Spinner from "./Spinner";

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
    };
  }
  initialValues = {
    name: "",
    email: "",
    phoneno: "",
    suggestion: "",
    subject: "",
  };

  validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter you name to contact us"),
    email: Yup.string().email().required("Please provide your email address"),
    phoneno: Yup.string()
      .required("Please provide your phone number")
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        "Phone number is not valid"
      ),

    subject: Yup.string().required("Please give the subject of your message"),
    suggestion: Yup.string().required(
      "Please write your suggestion/complaints"
    ),
  });

  onSubmit = (data) => {
    this.setState({
      sending: true,
    });
    axios
      .post("http://localhost:3001/contact", {
        data: data,
      })
      .then((response) => {
        if (response.data.error) {
          this.setState({
            sending: false,
          });
          swal({
            title: response.data.error,
            text: "Check your internet connection or try after sometime.",
            icon: "error",
            timer: 5000,
            button: false,
          });
        } else {
          this.setState({
            sending: false,
          });
          swal({
            title: response.data.success,
            text: "Thanks for your suggestion! We will connect to you shortly.",
            icon: "success",
            timer: 5000,
            button: false,
          });
        }
      });
  };

  render() {
    return (
      <div className="Contact">
        {this.state.sending ? (
          <Spinner />
        ) : (
          <div>
            <NavigateNavbar page={"contact-page"} />
            <h1 className="contact-heading">CONTACT US</h1>
            <p style={{ textAlign: "center" }}>
              <img src={contact} alt="contact" />
            </p>
            <p className="contact-description1">We'd &hearts; to help!</p>
            <p className="contact-description2">
              We like to create things with fun, open minded people. Fell free
              to contact.
            </p>

            <Formik
              initialValues={this.initialValues}
              onSubmit={this.onSubmit}
              validationSchema={this.validationSchema}
            >
              <Form className="formContainer contactFormContainer">
                <Field
                  className="contactDetail"
                  id="contactName"
                  name="name"
                  placeholder="Name"
                />
                <ErrorMessage name="name" component="span" />

                <Field
                  className="contactDetail"
                  id="contactEmail"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMessage name="email" component="span" />

                <Field
                  className="contactDetail"
                  id="contactPhone"
                  name="phoneno"
                  placeholder="Phone Number"
                />
                <ErrorMessage name="phoneno" component="span" />

                <Field
                  className="contactDetail"
                  id="contactSubject"
                  name="subject"
                  placeholder="Subject of your message"
                />
                <ErrorMessage name="subject" component="span" />

                <Field
                  as="textarea"
                  className="contactDetail"
                  id="contactSuggestion"
                  name="suggestion"
                  placeholder="Write your suggestions/complaints"
                />
                <ErrorMessage name="suggestion" component="span" />

                <button
                  style={{ marginTop: "10px" }}
                  type="submit"
                  className="btn btn-dark btn-lg"
                >
                  Send response
                </button>
              </Form>
            </Formik>
          </div>
        )}
      </div>
    );
  }
}
