const router = require("express").Router();
const _ = require("lodash");
const axios = require("axios");
const {newsServerURI} = require('../config/config');

router.get("/isAuthenticated",(req,res)=>{
  if(req.user){
    return res.send(_.pick(req.user,['email']));
  }
  else{
    return res.send({});
  }
});

router.get('/logout',(req,res)=>{
  req.logout();
  // res.redirect('/');
  res.status(200).send({});
});

router.post('/fetchNews',(req,res)=>{
  if(!req.body.pageNum){
    console.log("No page number");
    return res.status(400).json([]);
  }
  const pageNum = parseInt(req.body.pageNum);
  if(isNaN(pageNum)){
    console.log("Invalid Number");
    return res.status(400).json([]);
  }
  let params = {
    page_num: pageNum
  };
  if(req.user){
    params['user_id'] = req.user.id;
  }
  const request = axios.post(newsServerURI,{
    "method":"getNews",
	  "params": params,
	  "id": 0,
	  "jsonrpc": "2.0"
  }).then(({data})=>{
    if(data['result']){
      return res.status(200).json(data['result']);
    }
  }).catch((err)=>{
    console.log(err);
    return res.status(500).json([]);
  });
});

router.post('/logClicks',(req,res)=>{
  if(!req.body.news_label){
    console.log('No news label');
    return res.status(400).json();
  }
  let params = {
    news_label: req.body.news_label,
    user_id: req.user.id
  };
  const request = axios.post(newsServerURI,{
    "method":"clickLog",
	  "params": params,
	  "id": 0,
	  "jsonrpc": "2.0"
  }).then(
    ()=>{
      return res.status(200).json();
    }
  ).catch(
    (err)=>{
      console.log(err);
      return res.status(500).json();
    }
  );  
});

module.exports = router;
