import React, { Component } from 'react'
import Navbar from "./Navbar";

export default class Profile extends Component {
  render() {
    return (
      <div>
        <Navbar page={'profile-page'} />
        Profile
      </div>
    )
  }
}
