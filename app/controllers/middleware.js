const {getToken} = require('../utils/get-token')
const jwt = require('jsonwebtoken');
const {secretKey} = require('../config/config')
const User = require('./../models/index').User
const Token = require('./../models/index').AccessToken
const { Op } = require("sequelize");

function decodeToken(){
   return async function(req, res, next){
      try {
         let token = getToken(req);

         if(!token){
               return res.status(401).json({
                  status: false,
                  message: `Unauthorized`
               })
         }else{
               req.user = jwt.verify(token, secretKey)
   
               let accessToken = await Token.findOne({
                  where: {
                     token: token
                  }
               })
               if(!accessToken){
                  return res.status(401).json({
                     error: false,
                     message: `Unauthorized`
                  });
               }
               let user = await User.findByPk(accessToken.userId)
   
               if(!user){
                  return res.status(401).json({
                     error: false,
                     message: `token Expired`
                  });
               }
         }


      } catch (err) {
         if(err && err.name === 'JsonWebTokenError'){
               return res.status(401).json({
                  error: 422,
                  message: 'Authorization needed'
               });
         }

         next(err);
      }

      return next()
    }
}

module.exports= {decodeToken}