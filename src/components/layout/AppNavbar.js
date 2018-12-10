import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import PropTypes from "prop-types";

class AppNavbar extends Component {
  state = {
    isAuth: false
  };

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;
    if (auth.uid) {
      return { isAuth: true };
    } else {
      return { isAuth: false };
    }
  }

  onLogout = e => {
    e.preventDefault();

    const { firebase } = this.props;
    firebase.logout();
  };

  render() {
    const { isAuth } = this.state;
    const { auth } = this.props;
    const { allowRegistration } = this.props.settings;
    return (
      <nav className="navbar navbar-expand-md  navbar-dark bg-primary mb-4">
        <div className="container">
          <Link to="/">ClientPanel</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarMain"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarMain">
            {isAuth ? (
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <i className="fas fa-home" />
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/client/add" className="nav-link">
                    <i className="fas fa-plus" />
                    Add Client
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/settings" className="nav-link">
                    <i className="fas fa-cog" />
                    Settings
                  </Link>
                </li>
              </ul>
            ) : null}
            {isAuth ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a href="/" className="nav-link">
                    {auth.email}
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/" className="nav-link" onClick={this.onLogout}>
                    <i className="fas fa-sign-out-alt" />
                    Logout
                  </a>
                </li>
              </ul>
            ) : null}
            {allowRegistration && !isAuth ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </nav>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth,
    settings: state.settings
  }))
)(AppNavbar);
