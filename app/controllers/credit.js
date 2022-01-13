const Credit = require('../models/index').Credit
const Car = require('../models/index').Car
const {getPagingData, getPagination} = require('../utils/paginate')
const { Op } = require("sequelize");


async function index(req, res, next){
    try {
        const {carId, page, size} = req.query;
        const { limit, offset } = getPagination(page, size);

        if(!carId) return res.status(404).json({error: false, message: 'please input car id'})
        let credits = await Credit.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit,
            offset,
            where: {
                carId : carId
            }
        });

        res.status(200).json({
            status: true,
            message: 'Data successfully loaded',
            data: getPagingData(credits, page, limit),
        });
    } catch (error) {
        next(error)
    }
}

async function store(req, res, next){

    try {
        let payload = req.body
        let car = await Car.findByPk(payload.carId)
        if(!car) return res.status(404).json({error: false, message: 'Car not found'})
        
        if(payload.downPayment > ((car.price *3)/4)) return res.status(400).json({error: false, message: 'down Payment cannot exceed 75% from car price'})
        payload.creditPrice = parseFloat(car.price) + ((parseFloat(car.price) * parseFloat(payload.interest))/ 100) + parseFloat(payload.adminFee)
        const {...newPayload} = payload
        let credit = await Credit.create(newPayload)
        return res.status(201).json({
            status : true,
            data : credit.toJSON()
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
        let credit  = await Credit.findByPk(req.params.id);

        if(!credit) return res.status(404).json({error: false, message: 'Credit not found'})
        
        if(payload.downPayment > ((car.price *3)/4)) return res.status(400).json({error: false, message: 'down Payment cannot exceed 75% from car price'})
        payload.creditPrice = parseFloat(car.price) + ((parseFloat(car.price) * parseFloat(payload.interest))/ 100) + parseFloat(payload.adminFee)
        const {...newPayload} = payload
        let newCredit = await credit.update(newPayload)
        return res.status(201).json({
            status : true,
            data : newCredit.toJSON()
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
        
        let credit = await Credit.findByPk(req.params.id);
    
        if(!credit) return res.status(404).json({error: false, message: 'Credit not found'})
        else{
   
            await credit.destroy()
        
            res.json({
                status : true,
                message : 'Credit successfully deleted'
            });
        }

    } catch (error) {
        next(error)
    }
}


module.exports = {index, store, destroy, update}