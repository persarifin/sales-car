const User = require('../models/index').User
const Company = require('../models/index').Company
const {getPagingData, getPagination} = require('../utils/paginate')
const bcrypt = require('bcryptjs')


async function index(req, res, next){
    try {
        const { page, size} = req.query;
        const { limit, offset } = getPagination(page, size);

        let users = await User.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit,
            offset,
            attributes: {
                exclude: ['password']
            },
        });

        res.status(200).json({
            status: true,
            message: 'Data successfully loaded',
            data: getPagingData(users, page, limit),
        });
    } catch (error) {
        next(error)
    }
}

async function store(req, res, next){

    try {
        let payload = req.body
        const {...newPayload} = payload

        let user
        if(payload.company) {
            user = await User.create(newPayload, {include: 'company'})
        }
        else {
            user = await User.create(newPayload)
        }
        const {token, password, ...newUserWithoutToken} = user.toJSON();
        return res.status(201).json({
            status : true,
            data : newUserWithoutToken
        });

    } catch (error) {
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            return res.status(422).json({
                error: true,
                message: error.message,
                data: error.errors,
            })
        }

        next(error)
    }
}

async function update(req, res, next){
    try {
        let payload = req.body
        let user  = await User.findByPk(req.params.id);
        payload.companyId =  user.companyId
        payload.password = payload.password ? bcrypt.hashSync(payload.password, 10) : user.password

        if(!user) return res.status(404).json({error: false, message: 'user not found'})
        
        let newPayload= {...payload}
        let newUser
        if (payload.company){
            let company = await Company.findByPk(payload.companyId)
            await company.update(payload.company)
            await user.update(newPayload, {include:'company'})
            newUser = await User.findOne({
                where: {
                    id : req.params.id
                },
                include: ['company']
            })
        }else{
            newUser = await user.update(newPayload)
        }
        const {password, ...newUserWithoutToken} = newUser.toJSON();
        return res.status(201).json({
            status : true,
            data : newUserWithoutToken
        });
    } catch (error) {
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            return res.status(422).json({
                error: true,
                message: error.message,
                data: error.errors,
            })
        }

        next(error)
    }
}

async function destroy(req, res, next){
    try {
        
        let user = await User.findByPk(req.params.id);
    
        if(!user) return res.status(404).json({error: false, message: 'user not found'})
        else{

            let company = await Company.findByPk(user.companyId)
            company.destroy()
            await user.destroy()
        
            res.json({
                status : true,
                message : 'user '+ user.name + ' successfully deleted'
            });
        }

    } catch (error) {
        next(error)
    }
}


module.exports = {index, store, destroy, update}