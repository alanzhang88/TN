import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import promise from 'redux-promise';
import reducers from './reducers';
import NewsList from './components/news_list';
import Header from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
// import registerServiceWorker, {unregister} from './registerServiceWorker';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

const test = () => {
  return (<div>test</div>);
}

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Header />
        <Route exaxt path="/test" component={test} />
        <Route exact path="/news/:pageNum" component={NewsList} />
        <Route exact path="/" render={()=>(<Redirect to="/news/1" />)}/>
      </div>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'));
// registerServiceWorker();
// unregister();
