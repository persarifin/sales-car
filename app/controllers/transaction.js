const Transaction = require('../models/index').Transaction
const Submission = require('../models/index').Submission
const Wallet = require('../models/index').Wallet
const fs = require('fs')
const config = require('../config/config')
const path = require('path')
const {getPagingData, getPagination} = require('../utils/paginate')
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs')

async function index(req, res, next){
    try {
        const {submissionId, page, size} = req.query;
        const { limit, offset } = getPagination(page, size);
        let where
        if (submissionId) {
            where = {
                submissionId : submissionId
            }
        }
        let transactions = await Transaction.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit,
            offset,
            where : where
        });

        res.status(200).json({
            status: true,
            message: 'Data successfully loaded',
            data: getPagingData(transactions, page, limit),
        });
    } catch (error) {
        next(error)
    }
}

async function store(req, res, next){

    try {
        let payload = req.body

        let submission = await Submission.findByPk(payload.submissionId)
        if(!submission) return res.status(404).json({error: false, message: 'submission not found'})
        // return res.json(submission.toJSON())
        if(submission.status == "PAID") return res.status(403).json({error: false, message: 'submission already PAID'})
        
        let wallet = await Wallet.findByPk(payload.walletId)
        if(!wallet) return res.status(404).json({error: false, message: 'wallet not found'})

        if (parseInt(payload.amount) !== parseInt(submission.monthlyBill)) return res.status(404).json({error: false, message: 'amount must match the bill'})
        
        let newPayload = {...payload}
        let transaction = await Transaction.create(newPayload)

        let allTransaction = await Transaction.findOne({
            attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'amount']],
            where: {
                submissionId : payload.submissionId
            }
        })
        allTransaction = allTransaction.amount == null ? 0 : allTransaction.amount;

        submission.paid = allTransaction
        if(parseInt(allTransaction) < parseInt(submission.amountOfBill)) {
            submission.status = 'PARTIAL'
        }else if(parseInt(allTransaction) == parseInt(submission.amountOfBill)){
            submission.status = 'PAID'
        }
        else if ((parseInt(allTransaction)- parseInt(payload.amount)) < parseInt(submission.amountOfBill) && parseInt(allTransaction) > parseInt(submission.amountOfBill)) {
            
        }
        else return res.status(403).json({error: false, message: 'cannot exceed bill amount'})
        let submissionDate = new Date(submission.expiredPaymentAt)
        submissionDate.setMonth(submissionDate.getMonth() + 1, 1)
        submission.expiredPaymentAt = new Date(submissionDate)

        await submission.save()

        return res.status(201).json({
            status : true,
            data : transaction.toJSON(), 
            nextBill: {
                datePayment : submission.expiredPaymentAt,
                paid: submission.paid,
                amount: submission.monthlyBill
            }
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
        
        let transaction = await Transaction.findByPk(req.params.id);
    
        if(!transaction) return res.status(404).json({error: false, message: 'transaction not found'})
        else{
            let submission = Submission.findByPk(transaction.submissionId)
            let allTransaction = await Transaction.findAndCountAll({
                attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'amount']],
                where: {
                    submissionId : payload.submissionId
                }
            })
            allTransaction = allTransaction.amount == null ? 0 : allTransaction.amount;
    
            if(allTransaction < submission.amountOfBill) {
                submission.status = 'PARTIAL'
            }else if(allTransaction == submission.amountOfBill){
                submission.status = 'PAID'
            }
            else return res.status(404).json({error: false, message: 'amount exceed total bill'})
            submission.paid = allTransaction
            await submission.save()
   
            await transaction.destroy()
        
            res.json({
                status : true,
                message : 'transaction successfully deleted'
            });
        }

    } catch (error) {
        next(error)
    }
}


module.exports = {index, store, destroy}