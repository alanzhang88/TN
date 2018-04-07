import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import promise from 'redux-promise';
import reducers from './reducers';
import NewsList from './components/news_list';
import Header from './components/header';
import SignupLoginForm from './components/signup_login_form';
import 'bootstrap/dist/css/bootstrap.min.css';
// import registerServiceWorker, {unregister} from './registerServiceWorker';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Header />
        <Route exact path="/signup" render={(props)=>{return (<SignupLoginForm {...props} form="signupform" usage="signup" />);}} />
        <Route exact path="/login" render={(props)=>{return (<SignupLoginForm {...props} form="loginform" usage="login" />);}} />
        <Route exact path="/news/:pageNum" component={NewsList} />
        <Route exact path="/" render={()=>(<Redirect to="/news/1" />)}/>
      </div>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'));
// registerServiceWorker();
// unregister();
