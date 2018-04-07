import axios from 'axios';

export const FETCH_USER = 'fetch_user';
export const LOGOUT = 'logout';
export const FETCH_NEWS = 'fetch_news';
export const LOG_CLICK = 'log_click';
export const LOCAL_LOGIN = 'local_login';
export const LOCAL_SIGNUP = 'local_signup';

export function fetchUser(){
  const request = axios.get("/api/isAuthenticated");

  return {
    type: FETCH_USER,
    payload: request
  };
}

export function logout(callback){
  const request = axios.get("/api/logout").then(()=>{
    callback();
  });

  return {
    type: LOGOUT,
    payload: request
  };
}

export function fetchNews(pageNum){
  const request = axios.post("/api/fetchNews",{
    pageNum: pageNum
  });
  return {
    type: FETCH_NEWS,
    payload: request
  };
}

export function logClick(newsClass){
  const request = axios.post("/api/logClicks",{
    news_label: newsClass
  });
  return {
    type: LOG_CLICK,
    payload: request
  };
}

export function localLogin(values,callback){
  const request = axios.post('/api/login',values).then((res)=>{
    callback();
    return res;
  }).catch((err)=>{
    if(err.response)alert(err.response.data.error);
  });
  return {
    type: LOCAL_LOGIN,
    payload: request
  };
}

export function localSignup(values,callback){
  const request = axios.post('/api/signup',values).then(()=>{
    alert('Sign Up Succeed!');
    callback();
  }).catch((err)=>{
    // console.log(err.response);
    if(err.response)alert(err.response.data.error);
  });
  return {
    type: LOCAL_SIGNUP,
    payload: request
  };
}
