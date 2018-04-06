import axios from 'axios';

export const FETCH_USER = 'fetch_user';
export const LOGOUT = 'logout';
export const FETCH_NEWS = 'fetch_news';
export const LOG_CLICK = 'log_click';

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
