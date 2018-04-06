import {FETCH_NEWS} from '../actions';
import _ from 'lodash';

export default function(state=[],action){
  switch(action.type){
    case FETCH_NEWS:
      return action.payload.data ? _.cloneDeep(action.payload.data) : [];
    default:
      return state;
  }
}
