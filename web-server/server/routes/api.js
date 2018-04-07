const router = require("express").Router();
const _ = require("lodash");
const axios = require("axios");
const {newsServerURI, saltRounds} = require('../config/config');
const {User} = require('../models/user');
const {Account} = require('../models/account');
const bcrypt = require('bcrypt');
const passport = require('passport');

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
  if(!req.user){
    return res.status(401).json();
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

router.post('/signup',(req,res)=>{
  if(!req.body.username||!req.body.password){
    return res.status(400).json();
  }
  if(req.user){
    return res.status(400).json();
  }
  User.findOne({
    'email': req.body.username
  }).then((user)=>{
    if(user){
      console.log('User already exists');
      return res.status(400).json({error: 'User already exists'});
    }
    else{
      bcrypt.hash(req.body.password,saltRounds).then(
        (hash) => {
          return new Account({
            'email': req.body.username,
            'password': hash
          }).save();
        }
      ).then(
        (user)=>{
          console.log("Sign up success");
          return new User({
            'source': 'local',
            'email': user.email,
            'preference': []
          }).save();
        }
      ).then(
        ()=>{
          console.log("Sign up complete");
          // return res.redirect("/login"); //should redirect here
          return res.status(200).json();
        }
      ).catch((err)=>{
        console.log(err);
        return res.status(500).json({error: 'Server Error'});
      });
    }
  });
});

// router.post('/login', passport.authenticate('local',{
//   failureRedirect: '/login', //subject to change
// }), (req,res)=>{
//   console.log('Login success');
//   // res.redirect('/');
//   // console.log(req.user);
//   return res.status(200).send(_.pick(req.user,['email']));
// });

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',(err,user,info)=>{
    if(err){return next(err);}
    if(!user){
      // console.log(info);
      return res.status(401).json(info);
    }
    else{
      req.login(user,(err)=>{
        if(err){return next(err);}
        return res.status(200).send(_.pick(req.user,['email']));
      });
    }
  })(req,res,next);
});

module.exports = router;
