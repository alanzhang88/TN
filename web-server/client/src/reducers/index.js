import { combineReducers } from 'redux';
import userReducer from './reducer_user';
import newsReducer from './reducer_news';

const rootReducer = combineReducers({
  user: userReducer,
  newslist: newsReducer
});

export default rootReducer;
