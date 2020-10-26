// const chai = require('chai');
// const chaihttp = require('chai-http');
// const expect = chai.expect;

// const server = require('../server');

// chai.use(chaihttp);

// describe('Authentication controller testing', function() {
//     describe('# User Registration', function() {
//         it('check if user name is empty', function(done) {
//             chai.request('http://127.0.0.1:5000')
//             .post('/register')
//             .send({'name': '', 'email': 'test@mail.com', 'password': '12345678'})
//             .end(function(err, res) {
//                 expect(res).to.have.status(401);
//                 done();
//             })         
                                    
//         })
//     })
// })  

// const {expect} = require('chai');
// const sinon = require('sinon');

// const mongoose = require('mongoose');
// const User = require('../models/User');

// describe('Authentication controller testing', function() {
//     describe('# User Registration', function() {
//         before(function(done) {
//             const options = { 
//                 useNewUrlParser: true,
//                 useCreateIndex: true,
//                 useFindAndModify: false,
//                 useUnifiedTopology: true 
//             };
//             mongoose.connect('mongodb+srv://test:test123@cluster0-jqd2k.mongodb.net/test-reports?retryWrites=true&w=majority', options)
//             .then(result => {
//                 const user = new User({
//                     name: 'testtest',
//                     email: 'test@mail.com',
//                     password: '12345678',
//                     _id: '5f958d76209e5b2b6848d9e4'
//                 });
                
//                 return user.save();
//             })
//             .then(() => {
//                 done();
//             })
//         })   

//         it('check if user name is empty', function() {
            
//         })

//         after(function(done) {
//             User.deleteMany({})
//             .then(() => mongoose.disconnect())
//             .then(() => done());
//         })
//     })
// })