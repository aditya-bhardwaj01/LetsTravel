import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import travel from "../images/travel-logo.png";
import swal from 'sweetalert';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from "axios";

export default class Register extends Component {
    constructor(props){
        super(props);
    }
    initialValues = {
        name: "",
        email: "",
        phoneno: "",
        username: "",
        password: ""
    }
    

    validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is a required field"),
        email: Yup.string().email().required("Email is a required field"),
        phoneno: Yup.string().required("Phone number is a required field")
        .matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          "Phone number is not valid"
        ),
        username: Yup.string().min(3).max(15).required("User name is a required field"),
        password: Yup.string().min(4).max(20).required("Password is a required field")
    })

    onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then((response) => {
            if(response.data.error){
                swal({
                    title: "Failed!",
                    text: response.data.error,
                    icon: "error",
                    timer: 2000,
                    button: false
                });
            }
            else{
                swal({
                    title: "Success",
                    text: "You have successfully registered!",
                    icon: "success",
                    timer: 2000,
                    button: false
                });
                this.props.navigate("/");
            }
        })
    };

    render() {
        return (
            <div className='Register'>
                <div className="lr-logo">
                    <img src={travel} alt="LetsTravel" />
                </div>

                <Formik
                initialValues={this.initialValues}
                onSubmit={this.onSubmit}
                validationSchema={this.validationSchema}
                >
                    <Form className='formContainer'>
                        <Field
                            className='lr-input'
                            id="createUser"
                            name="name"
                            placeholder="Name"
                        />
                        <ErrorMessage name="name" component="span" />

                        <Field
                            className='lr-input'
                            id="createUser"
                            name="email"
                            placeholder="Email"
                        />
                        <ErrorMessage name="email" component="span" />

                        <Field
                            className='lr-input'
                            id="createUser"
                            name="phoneno"
                            placeholder="Phone Number"
                        />
                        <ErrorMessage name="phoneno" component="span" />

                        <Field
                            className='lr-input'
                            id="createUser"
                            name="username"
                            placeholder="User name"
                        />
                        <ErrorMessage name="username" component="span" />

                        <Field
                        type='password'
                            className='lr-input'
                            id="createUser"
                            name="password"
                            placeholder="Password"
                        />
                        <ErrorMessage name="password" component="span" />
                        <button type='submit' className="btn btn-primary btn-lg btn-block">Register user</button>
                    </Form>
                </Formik>
            </div>
        )
    }
}

export function NavigateRegister(props){
    const navigate = useNavigate();
    return (<Register navigate={navigate}></Register>)
}