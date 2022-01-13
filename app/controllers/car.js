const Car = require('../models/index').Car
const CarImage = require('../models/index').CarImage
const Credit = require('../models/index').Credit
const fs = require('fs')
const config = require('../config/config')
const path = require('path')
const {getPagingData, getPagination} = require('../utils/paginate')
const { Op } = require("sequelize");


async function index(req, res, next){
    try {
        const { page, size} = req.query;
        const { limit, offset } = getPagination(page, size);

        let cars = await Car.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            include: ['car_images','credits'],
            limit,
            offset,
        });

        res.status(200).json({
            status: true,
            message: 'Data successfully loaded',
            data: getPagingData(cars, page, limit),
        });
    } catch (error) {
        next(error)
    }
}

async function store(req, res, next){

    try {
        let payload = req.body
        payload.userId = payload.userId ? payload.userId : req.user.id

        if(payload.image){
            let tmp_path = req.image.path;
            let originalExt = req.image.originalname.split('.')[req.image.originalname.split('.').length - 1];
            let filename = req.image.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/car_images/${filename}`);
            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest)
            src.on('end', async () => {
                try{
                    let car = await Car.create({...payload, image : filename}, {include: 'car_images'});
                    return res.status(201).json({
                        status : true,
                        data : car.toJSON()
                    });
                }catch(error){
                    fs.unlinkSync(target_path);
                    
                    if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                        return res.status(422).json({
                            error: true,
                            message: error.message,
                            data: error.errors,
                        })
                    }

                    next(error)
                }
            })

            src.on('error', async() => {
                next(err)
            })
        }
        else{
            const {...newPayload} = payload

            let car = await Car.create(newPayload)
            return res.status(201).json({
                status : true,
                data : car.toJSON()
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

async function update(req, res, next){
    try {
        let payload = req.body
        payload.userId = payload.userId ? payload.userId : req.user.id
        let car  = await Car.findByPk(req.params.id);

        if(!car) return res.status(404).json({error: false, message: 'Car not found'})

        if(payload.image){
            let tmp_path = req.image.path;
            let originalExt = req.image.originalname.split('.')[req.image.originalname.split('.').length - 1];
            let filename = req.image.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/car_images/${filename}`);
            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest)
            src.on('end', async () => {
                try{
                    let carImage = CarImage.findOne({where: { carId : car.id }})
                    let currentImage = `${config.rootPath}/public/car_images/${carImage.image}`;
                    if(fs.existsSync(currentImage)){
                        fs.unlinkSync(currentImage);
                    }
                    let car = await car.update({...payload, image : filename}, {include: 'car_images'});
                    return res.status(201).json({
                        status : true,
                        data : car.toJSON()
                    });
                }catch(error){
                    fs.unlinkSync(target_path);
                    
                    if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                        return res.status(422).json({
                            error: true,
                            message: error.message,
                            data: error.errors,
                        })
                    }

                    next(error)
                }
            })

            src.on('error', async() => {
                next(err)
            })
        }
        const {...newPayload} = payload
        let newCar = await car.update(newPayload)
        return res.status(201).json({
            status : true,
            data : newCar.toJSON()
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
        
        let car = await Car.findByPk(req.params.id);
    
        if(!car) return res.status(404).json({error: false, message: 'Car not found'})
        else{

            let image = await CarImage.findAll({
                where : {
                    carId : car.id
                },
                attributes: ['id']
            })
            await CarImage.destroy({where:{id:image}})

            let credit = await Credit.findAll({
                where : {
                    carId : car.id
                },
                attributes: ['id']
            })
            await Credit.destroy({where:{id:credit}})
            
            await car.destroy()
        
            res.json({
                status : true,
                message : 'Car successfully deleted'
            });
        }

    } catch (error) {
        next(error)
    }
}


module.exports = {index, store, destroy, update}