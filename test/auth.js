// const {expect} = require('chai');
// const sinon = require('sinon');

// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const User = require('../models/User');

// const dotenv = require('dotenv');

// const {protect, authorize} = require('../middleware/auth');

// dotenv.config({
//     path: "./config/config.env"
// });

// describe('check for user identification middleware', function() {
//     before(function(done) {
//         const options = { 
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useFindAndModify: false,
//             useUnifiedTopology: true 
//         };
//         mongoose.connect(process.env.MONGO_URI_TEST, options)
//         .then(result => {
//             const user = new User({
//                 name: 'testtest',
//                 email: 'test@mail.com',
//                 password: '12345678',
//                 _id: '5f958d76209e5b2b6848d9e4'
//             });
            
//             return user.save();
//         })
//         .then(() => {
//             done();
//         })
//     })  

//     it('check for invalid token sent via cookie or header', function(done) {
//         let req = {
//             headers: {},
//             cookies: {}
//         };

//         let res = {};

//         function next (err) {
//             const error = err;
//             if (error) {
//                 res.statusCode = error.statusCode;
//                 res.message = error.message;
//             }
//             return res;
//         };

//             protect(req, {}, next).then(result => {
//             //console.log(result);
//             expect(res.statusCode).to.be.equal(401);
//             expect(res.message).to.be.string('Korisnik nema autorizaciju da pristupi ovoj ruti..');
//             done();
//         });
//     });

//     it('pull user from database after passing valid token', function(done) {
//         let req = {
//             headers: {},
//             cookies: {
//                 token: '5f958d76209e5b2b6848d9e4'
//             },
//             user: {}
//         };

//         sinon.stub(jwt, 'verify');
//         jwt.verify.returns({id: '5f958d76209e5b2b6848d9e4'});
//         protect(req, {}, () => {}).then(result => {
//             //console.log(req);
//             expect(req.user.name).to.be.equal('testtest');
//             done();
//             jwt.verify.restore();
//         })
//     });

//     // available roles = ['admin', 'qc', 'sales']
//     it('authorization check for specific user role - authorized user', function(done) {
//         let req = {
//             user: {
//                 role: 'admin'
//             }
//         };

//         let res = {};

//         function next (err) {
//             const error = err;
//             if (error) {
//                 res.statusCode = error.statusCode;
//                 res.message = error.message;
//             }
//             return res;
//         };

//         const role = authorize('admin', 'qc');
//         role(req, res, next);
//         //console.log(res);
//         expect(res).to.be.empty;
//         done();
//     });

//     it('authorization check for specific user role - unauthorized user', function(done) {
//         let req = {
//             user: {
//                 role: 'sales'
//             }
//         };

//         let res = {};

//         function next (err) {
//             const error = err;
//             if (error) {
//                 res.statusCode = error.statusCode;
//                 res.message = error.message;
//             }
//             return res;
//         };

//         const role = authorize('admin', 'qc');
//         role(req, res, next);
//         //console.log(res);
//         expect(res.statusCode).to.be.equal(403);
//         done();
//     });

//     after(function (done) {
//         User.deleteMany({})
//             .then(() => {
//                 return mongoose.connection.close();
//             })
//             .then(() => {
//                 done();
//             });
//     });
// })