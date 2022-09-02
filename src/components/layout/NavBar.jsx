import React, { Component } from 'react';
import './navbar.css';

export default class NavBar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <a href="#" className="navbar-brand col-sm-3 col-md-2 mr-0 align-items-center" style={{marginLeft: "20px"}}>Pokedex</a>
        </nav>
      </div>
    )
  }
}
