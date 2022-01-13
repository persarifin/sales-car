const Submission = require('../models/index').Submission
const Car = require('../models/index').Car
const Credit = require('../models/index').Credit
const {getPagingData, getPagination} = require('../utils/paginate')
const { QueryTypes } = require("sequelize");
const Sequelize = require("sequelize");


async function report(req, res, next){
    try {
        const { page, size} = req.query;
        const { limit, offset } = getPagination(page, size);
        
        let submissions = await Submission.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit,
            offset,
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT  user.name FROM Cars
                            as car
                            inner join Users as user on car.userId = user.id
                            WHERE
                                car.id = Submission.carId
                        )`), 'user'
                    ],
                ]
            },
            include: ['car','credit','transactions'],
            order: [Sequelize.literal('user'),'expiredPaymentAt']
        });


        res.status(200).json({
            status: true,
            message: 'Data successfully loaded',
            data: getPagingData(submissions, page, limit),
        });
    } catch (error) {
        next(error)
    }
}

async function index(req, res, next){
    try {
        const { page, size} = req.query;
        const { limit, offset } = getPagination(page, size);

        let submissions = await Submission.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit,
            offset,
            include: ['car','credit','transactions']
        });

        res.status(200).json({
            status: true,
            message: 'Data successfully loaded',
            data: getPagingData(submissions, page, limit),
        });
    } catch (error) {
        next(error)
    }
}

async function store(req, res, next){

    try {
        let payload = req.body
        let car = await Car.findByPk(payload.carId)
        
        if (!car) return res.status(404).json({error: false, message: 'Car not found'})
                            
        const d = new Date();
        let month = d.getMonth() < 10 ? "0"+(d.getMonth() + 1):(d.getMonth() + 1)
        let sequence = await Submission.findOne({
            order: [['id' , 'DESC']],
            attributes: ['id']
        })
        payload.invoice = "INVOICE"+ d.getDate() +month+d.getFullYear() + (sequence == null ?0 : sequence.id +1);

        let newPayload
        if (payload.creditId) {
            let credit = await Credit.findOne({
                where:[
                    {id: payload.creditId},
                    {carId: car.id}
                ]
            })
            if (!credit) return res.status(404).json({error: false, message: 'Credit not found'})

            payload.amountOfBill = credit.creditPrice
            payload.monthlyBill = (credit.creditPrice / parseFloat(credit.optionMonth))

            payload.expiredPaymentAt = d
            newPayload =  {...payload, status : "UNPAID", paid : 0 }
            newSubmission = await Submission.create(newPayload)

        }else{
            payload.transactions['amount'] = car.price
            newPayload =  {...payload, invoice: invoice, monthlyBill: 0, amountOfBill: car.price, status: "PAID",paid:car.price} 
    
            newSubmission = await Submission.create(newPayload, {include: 'transactions'})
        }
        return res.status(201).json({
            status : true,
            data : newSubmission.toJSON()
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
        let submission  = await Submission.findByPk(req.params.id);

        if(!submission) return res.status(404).json({error: false, message: 'Submission not found'})

        if(submission.status !== 'UNPAID') return res.status(404).json({error: false, message: 'cannot Update submission when status not UNPAID'})

        let car = await Car.findByPk(payload.carId)
        
        if (!car) return res.status(404).json({error: false, message: 'Car not found'})
        
        const d = new Date();
        let month = d.getMonth() < 10 ? "0"+(d.getMonth() + 1):(d.getMonth() + 1)
        let sequence = await Submission.findOne({
            order: [['id' , 'DESC']],
            attributes: ['id']
        })
        let invoice = "INVOICE"+ d.getDate() +month+d.getFullYear() + (sequence == null ?0 : sequence.id +1);

        let newPayload
        let newSubmission
        if (payload.creditId) {
            let credit = await Credit.findOne({
                where:[
                    {id: payload.creditId},
                    {carId: car.id}
                ]
            })
            if (!credit) return res.status(404).json({error: false, message: 'Credit not found'})

            payload.amountOfBill = credit.creditPrice
            payload.monthlyBill = (credit.creditPrice / parseFloat(credit.optionMonth))

            payload.expiredPaymentAt = d
            newPayload =  {...payload, status : "UNPAID", paid : 0 }
            newSubmission = await submission.update(newPayload)

        }else{
            payload.transactions['amount'] = car.price
            newPayload =  {...payload, invoice: invoice, monthlyBill:0, amountOfBill: car.price, status: "PAID",paid: car.price} 
    
            newSubmission = await submission.update(newPayload, {include: 'transactions'})
        }
        
        return res.status(201).json({
            status : true,
            data : newSubmission.toJSON()
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
        
        let submission = await Submission.findByPk(req.params.id);
    
        if(submission.status !== 'UNPAID') return res.status(404).json({error: false, message: 'delete submission not allowed'})

        if(!submission) return res.status(404).json({error: false, message: 'Submission not found'})
        else{
   
            await submission.destroy()
        
            res.json({
                status : true,
                message : 'Submission successfully deleted'
            });
        }

    } catch (error) {
        next(error)
    }
}


module.exports = {index, store, destroy, update,report}