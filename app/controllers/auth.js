const passport = require('passport')
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('./../models/index').User
const Token = require('./../models/index').AccessToken
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
const {secretKey} = require('../config/config')
const {getToken} = require('../utils/get-token')

async function login(req, res, next){
    passport.authenticate('local', async function(err, user){
        if(err) return next(err);

        if(!user) return res.status(401).json({error: true, message: 'email or password incorrect'})

        let token = jwt.sign(user, secretKey);

        await Token.create({
            'token' : token,
            'userId' : user.id
        });

        return res.json({
            message: 'logged success',
            user,
            token
        })

    })(req,res,next);
}

async function localStartegy(email, password, done){
    try {
        let user = await User.findOne({
            attributes: {
                exclude: ['token', 'createdAt', 'updatedAt']
            },
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        })

        if (!user) return done()

        if(bcrypt.compareSync(password, user.password)){
            ( {password, ...userWithoutPassword} = user.toJSON() );
            return done(null, userWithoutPassword);
        }

    } catch (error) {
        done(error, null)
    }

    done();
}

async function logout(req, res, next){
    let token = getToken(req);
    let findToken = await Token.findOne({
        where:{
           token: token
        }
    })
    await findToken.destroy()

    let user = User.findByPk(findToken.userId)

    if(!user){
        return res.json({
            error: false,
            message: 'Token Expired'
        });
    }

    return res.json({
        error: false,
        message: 'Logout success'
    });
}

module.exports = {login, localStartegy, logout}