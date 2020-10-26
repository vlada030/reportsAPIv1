const {expect} = require('chai');
const sinon = require('sinon');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const {protect, authorize} = require('../middleware/auth');

describe('check for user identification middleware', function() {
    // it('check for invalid token sent via requests header authorization', function() {
    //     let req = {
    //         headers: {
    //             authorization: 'Bearer '
    //         }
    //     };

    //     let res = {};

    //     function next (err) {
    //         const error = err;
    //         res.statusCode = error.statusCode;
    //         res.message = error.message;
    //         return res;
    //     };
        
    //     protect(req, {}, next).then(result => {
    //         //console.log(result);
    //         expect(res.statusCode).to.be.equal(401);
    //         expect(res.message).to.be.string('Korisnik nema autorizaciju da pristupi ovoj ruti.');
    //     });
    // });

    before(function(done) {
        const options = { 
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true 
        };
        mongoose.connect('mongodb+srv://test:test123@cluster0-jqd2k.mongodb.net/test-reports?retryWrites=true&w=majority', options)
        .then(result => {
            const user = new User({
                name: 'testtest',
                email: 'test@mail.com',
                password: '12345678',
                _id: '5f958d76209e5b2b6848d9e4'
            });
            
            return user.save();
        })
        .then(() => {
            done();
        })
    })  

    // it('check for invalid token sent via cookie or header', async function() {
    //     let req = {
    //         headers: {},
    //         cookies: {}
    //     };

    //     let res = {};

    //     function next (err) {
    //         const error = err;
    //         res.statusCode = error.statusCode;
    //         res.message = error.message;
    //         return res;
    //     };

    //     const result = await protect(req, {}, next);
    //     //console.log(result);
    //     expect(result.statusCode).to.be.equal(401);
    //     expect(result.message).to.be.string('Korisnik nema autorizaciju da pristupi ovoj ruti.');
        
    // })

    it('pull valid user from database', function(done) {
        let req = {
            headers: {},
            cookies: {
                token: '5f958d76209e5b2b6848d9e4'
            },
            user: {}
        };

        sinon.stub(jwt, 'verify');
        jwt.verify.returns('5f958d76209e5b2b6848d9e4');
        protect(req, {}, () => {}).then(result => {
            console.log(req);
            expect(req.decode).to.be.equal('5f958d76209e5b2b6848d9e4');
            done();
        })
        // console.log(req);
        
        // expect(req.user.name).to.be.equal('testtest');
        // done();
        jwt.verify.restore();

    })

    after(function(done) {
        User.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => done());
    })
})
