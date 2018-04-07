import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import validator from 'validator';
import {connect} from 'react-redux';
import {localSignup, localLogin} from '../actions';
import {withRouter} from 'react-router';


class SignupLoginForm extends Component{

  renderField(field){
    const className = `form-control ${field.meta.touched && field.meta.error ? 'is-invalid' : ''}`;
    return (
      <div className="form-group">
        <label>{field.label}:</label>
        <input {...field.input} type={field.inputUsage} className={className} />
        <small className="form-text text-danger">{field.meta.touched ? field.meta.error : ''}</small>
      </div>
    );
  }

  onSubmit(values){
    // console.log(values);
    // this.props.localAuthenticate(values,this.props.usage,()=>{this.props.history.push(`${this.props.usage === "signup" ? '/login' : '/'}`)});
    if(this.props.usage === "signup"){
      this.props.localSignup(values,() => this.props.history.push("/login"));
    }
    else {
      this.props.localLogin(values,() => this.props.history.push("/news/1"));
    }
    this.props.reset(this.props.form);
    // this.props.clearSubmitErrors(this.props.form);
  }

  render(){
    // console.log(this.props.usage, this.props);
    const {handleSubmit} = this.props;
    return (
      <div className="container" style={{'marginTop': '20px'}}>
        <div className="row">
          <div className="col-md-12 justify-content-center">
            <h3>Please {this.props.usage} here!</h3>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <Field label="Email" name="username" inputUsage="email" component={this.renderField} validate={[required,isEmail]}/>
              <Field label="Password" name="password" inputUsage="password" component={this.renderField} validate={[required,isLength]}/>
              <button type="submit" className="btn btn-primary" disabled={this.props.invalid}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const required = value => (value ? undefined : 'Required')
const isLength = value => {
  if(validator.isLength(value,{min:6, max:16})){
    return undefined;
  }
  else return "Please enter a password with length between 6 and 16";
}
const isEmail = value => {
  if(validator.isEmail(value)){
    return undefined;
  }
  else return "Please enter a valid email";
}
// function validate(values){
//   let errors = {};
//   if(!values.username || !validator.isEmail(values.username)){
//     errors.username = "Please enter a valid email";
//   }
//   if(!values.password || !validator.isLength(values.password,{min:6, max:16})){
//     errors.password = "Please enter a password with length between 6 and 16";
//   }
//
//   return errors
// }



export default reduxForm()(connect(null,{localSignup,localLogin})(withRouter(SignupLoginForm)));
