import React, { Component } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Register, {NavigateRegister} from "./components/Register";
import Login, {NavigateLogin} from "./components/Login";
import Home, {NavigateProfileFromHome} from "./components/Home";
import Contact from "./components/Contact";
import Profile, {NavigateProfile} from "./components/Profile";
import Settings, {NavigateSettings} from './components/Settings';
import { NavigateSearchResult } from './components/SearchResult';
import { NavigateChat } from './components/Chat';

export default class App extends Component {
  render() {
    return (
      <div className='App'>
        <Router>
          <Routes>
            <Route exact path="/" element={<NavigateLogin />} />
            <Route exact path="/register" element={<NavigateRegister />} />
            <Route exact path='/home' element={<NavigateProfileFromHome />} />
            <Route exact path='/contact' element={<Contact />} />
            <Route exact path='/settings' element={<NavigateSettings />} />
            <Route exact path='/profile/:username' element={<NavigateProfile />} />
            <Route exact path='/searchResult/:location' element={<NavigateSearchResult />} />
            <Route exact path='/chat' element={<NavigateChat />} />
          </Routes>
        </Router>
      </div>
    )
  }
}

