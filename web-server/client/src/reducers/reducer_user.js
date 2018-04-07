import { FETCH_USER, LOGOUT, LOCAL_LOGIN } from '../actions';

export default function (state = {}, action){
  switch(action.type){
    case FETCH_USER:
      // console.log(action.payload);
      return {...action.payload.data};
    case LOGOUT:
      return {};
    case LOCAL_LOGIN:
      // console.log(action.payload);
      return action.payload ? {...action.payload.data} : {};
    default:
      return state;
  }
}
