import { FETCH_USER, LOGOUT } from '../actions';

export default function (state = {}, action){
  switch(action.type){
    case FETCH_USER:
      // console.log(action.payload);
      return {...action.payload.data};
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
