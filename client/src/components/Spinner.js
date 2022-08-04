import React, { Component } from 'react'
import loading from '../images/loading.gif'

export default class Spinner extends Component {
  render() {
    return (
      <div className='text-center' 
          style={{height: 100+'vh', width: 100+'%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img src={loading} alt="loading" style={{borderRadius: '200px', height: '200px', width: '200px'}}/>
      </div>
    )
  }
}
