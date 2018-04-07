import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchUser, logout} from '../actions';
import { withRouter } from 'react-router';

class Header extends Component {

  componentDidMount(){
    // this.unlisten = this.props.history.listen((location,action)=>{
    //   // console.log("on route change");
    //   this.props.fetchUser();
    // });
    this.props.fetchUser();
  }

  // componentWillUnmount(){
  //   this.unlisten();
  // }

  serverLogout(){
    this.props.logout(()=>this.props.history.push("/"));
  }

  renderUser(){
    if(this.props.user.email){
      return (
        <ul className="navbar-nav nav-justified justify-content-end">
          <li className="nav-item">
            <span className="nav-link active">{this.props.user.email}</span>
          </li>
          <li className="nav-item">
            <a onClick={this.serverLogout.bind(this)} style={{"cursor": "pointer"}} className="nav-link">Logout</a>
          </li>
        </ul>
      );
    }
    else{
      // console.log("Not logged in");
      return (
        <ul className="nav navbar-nav justify-content-end">
          <li className="nav-item">
            <Link className="nav-link" to="/signup">Sign Up</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">Log In</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/auth/google">Sign in with Google</a>
          </li>
        </ul>
      );
    }
  }

  render(){
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">TapNews</Link>
              {this.renderUser()}
          </div>
        </nav>
      </div>
    );
  }
}

function mapPropsToState(state){
  return {
    user: state.user
  }
}

export default connect(mapPropsToState,{fetchUser,logout})(withRouter(Header));
