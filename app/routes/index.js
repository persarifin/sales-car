const UserController = require('./../controllers/users')
const SubmissionController = require('./../controllers/submission')
const TransactionController = require('./../controllers/transaction')
const CarController = require('./../controllers/car')
const CreditController = require('./../controllers/credit')
const WalletController = require('./../controllers/wallet')
const AuthController  = require('./../controllers/auth')
const router = require('express').Router();
const multer = require('multer')
const os = require('os')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { decodeToken } = require('./../controllers/middleware');


passport.use(new LocalStrategy({usernameField: 'email'}, AuthController.localStartegy));
router.post('/login', multer().none(), AuthController.login)
router.post('/logout', [multer().none(), decodeToken()], AuthController.logout)

router.get('/users', multer().none(), UserController.index)
router.post('/users', [multer().none(), decodeToken()], UserController.store)
router.put('/users/:id', [multer().none(), decodeToken()], UserController.update)
router.delete('/users/:id', [multer().none(), decodeToken()], UserController.destroy)

// submission
router.get('/submission', [multer().none(), decodeToken()], SubmissionController.index)
router.get('/submission/report', [multer().none(), decodeToken()], SubmissionController.report)
router.post('/submission', [multer().none(), decodeToken()], SubmissionController.store)
router.put('/submission/:id', [multer().none(), decodeToken()], SubmissionController.update)
router.delete('/submission/:id', [multer().none(), decodeToken()], SubmissionController.destroy)

// wallet
router.get('/wallet', [multer().none(), decodeToken()], WalletController.index)
router.post('/wallet', [multer().none(), decodeToken()], WalletController.store)
router.put('/wallet/:id', [multer().none(), decodeToken()], WalletController.update)
router.delete('/wallet/:id', [multer().none(), decodeToken()], WalletController.destroy)

// car
router.get('/car', [multer().none(), decodeToken()], CarController.index)
router.post('/car', [multer({dest: os.tmpdir()}).single('image'), decodeToken()], CarController.store)
router.put('/car/:id', [multer({dest: os.tmpdir()}).single('image'), decodeToken()], CarController.update)
router.delete('/car/:id', [multer().none(), decodeToken()], CarController.destroy)
// credit
router.get('/credit', [multer().none(), decodeToken()], CreditController.index)
router.post('/credit', [multer().none(), decodeToken()], CreditController.store)
router.put('/credit/:id', [multer().none(), decodeToken()], CreditController.update)
router.delete('/credit/:id', [multer().none(), decodeToken()], CreditController.destroy)

// transaction
router.get('/transaction', [multer().none(), decodeToken()], TransactionController.index)
router.post('/transaction', [multer().none(), decodeToken()], TransactionController.store)
router.delete('/transaction/:id', [multer().none(), decodeToken()], TransactionController.destroy)

module.exports = router
