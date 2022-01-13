const Wallet = require('../models/index').Wallet
const Transaction = require('../models/index').Wallet
const {getPagingData, getPagination} = require('../utils/paginate')


async function index(req, res, next){
    try {
        const { page, size} = req.query;
        const { limit, offset } = getPagination(page, size);

        let wallets = await Wallet.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit,
            offset,
        });

        res.status(200).json({
            status: true,
            message: 'Data successfully loaded',
            data: getPagingData(wallets, page, limit),
        });
    } catch (error) {
        next(error)
    }
}

async function store(req, res, next){

    try {
        let payload = req.body
        const {...newPayload} = payload
        let wallet = await Wallet.create(newPayload)
        return res.status(201).json({
            status : true,
            data : wallet.toJSON()
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
        let wallet  = await Wallet.findByPk(req.params.id);

        if(!wallet) return res.status(404).json({error: false, message: 'wallet not found'})
        else{
            const {...newPayload} = payload
            let newWallet = await wallet.update(newPayload)
            return res.json({
                status : true,
                data : newWallet.toJSON()
            });
        }
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
        
        let wallet = await Wallet.findByPk(req.params.id);
    
        if(!wallet) return res.status(404).json({error: false, message: 'wallet not found'})
        else{
   
            let transaction = Transaction.findAndCountAll({
                where: {
                    walletId: wallet.id
                }
            })
            if (transaction.count > 0) return res.status(406).json({error: false, message: 'wallet cannot deleted, its has used by transaction'})
            await wallet.destroy()
        
            res.json({
                status : true,
                message : 'wallet '+ wallet.name + ' successfully deleted'
            });
        }

    } catch (error) {
        next(error)
    }
}


module.exports = {index, store, destroy, update}