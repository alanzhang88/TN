import { combineReducers } from 'redux';
import userReducer from './reducer_user';
import newsReducer from './reducer_news';
import {reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  user: userReducer,
  newslist: newsReducer,
  form: formReducer
});

export default rootReducer;
