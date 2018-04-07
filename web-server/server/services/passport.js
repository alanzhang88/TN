const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { googleClientID, googleClientSecret } = require('../config/config');
const { User } = require('../models/user');
const { Account } = require('../models/account');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id).then((user)=>{
    done(null,user);
  }).catch((err)=>{
    console.log(err);
    done(err);
  });
});

passport.use(
  new GoogleStrategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google/callback'
  },(accessToken,refreshToken,profile,done) => {
    // console.log('profile', profile);
    const userId = profile.id;
    var email = null;
    if(profile.emails && profile.emails.length > 0){
      email = profile.emails[0].value;
    }
    User.findOne({userId:userId, source:'google'}).then(
      (user) => {
        if(!user){
          new User({
            source: 'google',
            userId: userId,
            email: email
          }).save().then(
            res => done(null,res)
          ).catch(err => console.log(err));
        }
        else{
          done(null,user);
        }
      }
    ).catch(
      (err) => {
        console.log(err);
        done(err);
      }
    );
  })
);

passport.use(new LocalStrategy(
  (username,password,done) => {
    Account.findOne({
      email: username
    }).then((user)=>{
      if(!user){
        return done(null,false,{error: 'Incorrect username.'});
      }
      bcrypt.compare(password,user.password).then(
        (res) => {
          if(res){
            User.findOne({
              email: username
            }).then(
              (retuser) => {
                return done(null,retuser);
              }
            );
          }
          else{
            return done(null,false,{error: 'Incorrect password.'});
          }
        }
      )
    }).catch((err)=>{
      console.log(err);
      done(err);
    });
  }
));

module.exports = {passport};
