// https://livecodestream.dev/post/2020-08-26-testing-in-nodejs-using-mocha-and-chai-part-2/
// https://scotch.io/tutorials/how-to-test-nodejs-apps-using-mocha-chai-and-sinonjs


// const chai = require('chai');
// const chaihttp = require('chai-http');
// const expect = chai.expect;

// const server = require('../server');

// chai.use(chaihttp);

// describe('Authentication controller testing', function() {
//     describe('# User Registration', function() {
//         it('check if user name is empty', async function() {
//             let res = await chai.request(server)
//             .post('/api/v1/auth/register')
//             .send({'name': '', 'email': 'test@mail.com', 'password': '12345678'});
            
//             expect(res).to.have.status(401);  
                                                     
//         })
//     })
// })  

const chai = require('chai');
const chaihttp = require('chai-http');
const sinon = require('sinon');

const mongoose = require('mongoose');
const User = require('../models/User');
const server = require('../server');

chai.use(chaihttp);

describe('Authentication controller testing', function() {
    describe('# User Registration', function() {
        // before(function(done) {
        //     const options = { 
        //         useNewUrlParser: true,
        //         useCreateIndex: true,
        //         useFindAndModify: false,
        //         useUnifiedTopology: true 
        //     };
        //     mongoose.connect('mongodb+srv://test:test123@cluster0-jqd2k.mongodb.net/test-reports?retryWrites=true&w=majority', options)
        //     // .then(result => {
        //     //     const user = new User({
        //     //         name: 'testtest',
        //     //         email: 'test@mail.com',
        //     //         password: '12345678',
        //     //         _id: '5f958d76209e5b2b6848d9e4'
        //     //     });
                
        //     //     return user.save();
        //     // })
        //     .then(() => {
        //         done();
        //     })
        // })   
        before(async function() {
            const options = { 
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true 
            };
            await mongoose.connect('mongodb+srv://test:test123@cluster0-jqd2k.mongodb.net/test-reports?retryWrites=true&w=majority', options);
            // .then(result => {
            //     const user = new User({
            //         name: 'testtest',
            //         email: 'test@mail.com',
            //         password: '12345678',
            //         _id: '5f958d76209e5b2b6848d9e4'
            //     });    
            //     return user.save();
            // })
        })   

        it.only('check if user name is empty', async function() {
            let res = await chai.request('http://localhost:5000')
            .post('/api/v1/auth/register')
            .send({'name': '', 'email': 'test@mail.com', 'password': '12345678'})
            console.log(res.text);
            chai.expect(res).to.have.status(401);    
        })

        // after(function(done) {
        //     User.deleteMany({})
        //     .then(() => mongoose.disconnect())
        //     .then(() => done());
        // })

        after(async function() {
            await mongoose.disconnect();            
        })
    })
})