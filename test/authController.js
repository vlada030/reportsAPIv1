const chai = require("chai");
const chaihttp = require("chai-http");
const expect = chai.expect;

const mongoose = require("mongoose");
const User = require("../models/User");
const server = require("../server");
const authController = require('../controllers/authController');

chai.use(chaihttp);

describe("Authentication controller testing", function () {
    describe("# User Registration", function () {
        beforeEach(async function () {
            await User.deleteMany({});
        });

        it("check if user name field is empty & return status code 401", function (done) {
            chai.request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "",
                    email: "test@mail.com",
                    password: "12345678",
                    confirmPassword: "12345678",
                })
                .end(function (err, res) {
                    const obj = JSON.parse(res.text);
                    //console.log(obj.error);
                    expect(res).to.have.status(401);
                    expect(obj.error).to.have.string("Unesite korisničko ime");

                    done();
                });
        });

        it("check if user name is larger than 15 characters & return status code 401", async function () {
            let res = await chai
                .request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "testtesttesttest",
                    email: "test@mail.com",
                    password: "12345678",
                    confirmPassword: "12345678",
                });

            const obj = JSON.parse(res.text);
            expect(res).to.have.status(401);
            expect(obj.error).to.have.string(
                "Korisničko ime može sadržati najviše 15 karaktera"
            );
        });

        it("check if email field is empty & return status code 401", function (done) {
            chai.request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test",
                    email: "",
                    password: "12345678",
                    confirmPassword: "12345678",
                })
                .end(function (err, res) {
                    const obj = JSON.parse(res.text);
                    expect(res).to.have.status(401);
                    expect(obj.error).to.have.string(
                        "Unesite ispravnu email adresu"
                    );
                    done();
                });
        });

        it("check if email is invalid & return status code 401", function (done) {
            chai.request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test",
                    email: "test.com",
                    password: "12345678",
                    confirmPassword: "12345678",
                })
                .end(function (err, res) {
                    const obj = JSON.parse(res.text);
                    expect(res).to.have.status(401);
                    expect(obj.error).to.have.string(
                        "Unesite ispravnu email adresu"
                    );
                    done();
                });
        });

        it("check if password has less than 7 characters & return status code 401", function (done) {
            chai.request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test",
                    email: "test@mail.com",
                    password: "123",
                    confirmPassword: "12345678",
                })
                .end(function (err, res) {
                    const obj = JSON.parse(res.text);
                    expect(res).to.have.status(401);
                    expect(obj.error).to.have.string(
                        "Šifra treba da sadrži slova i brojeve, 7 - 15 karaktera"
                    );
                    done();
                });
        });

        it("check if password has more than 15 characters & return status code 401", function (done) {
            chai.request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test",
                    email: "test@mail.com",
                    password: "12345678912345678",
                    confirmPassword: "12345678",
                })
                .end(function (err, res) {
                    const obj = JSON.parse(res.text);
                    expect(res).to.have.status(401);
                    expect(obj.error).to.have.string(
                        "Šifra treba da sadrži slova i brojeve, 7 - 15 karaktera"
                    );
                    done();
                });
        });

        it("check if password has non Alphanumeric characters & return status code 401", function (done) {
            chai.request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test",
                    email: "test@mail.com",
                    password: "12345678.!?,",
                    confirmPassword: "12345678",
                })
                .end(function (err, res) {
                    const obj = JSON.parse(res.text);
                    expect(res).to.have.status(401);
                    expect(obj.error).to.have.string(
                        "Šifra treba da sadrži slova i brojeve, 7 - 15 karaktera"
                    );
                    done();
                });
        });

        it("check if repeteaded password doesn't match password & return status code 401", function (done) {
            chai.request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test",
                    email: "test@mail.com",
                    password: "12345678",
                    confirmPassword: "123456789",
                })
                .end(function (err, res) {
                    const obj = JSON.parse(res.text);
                    expect(res).to.have.status(401);
                    expect(obj.error).to.have.string(
                        "Šifre se ne podudaraju, ponovite unos"
                    );
                    done();
                });
        });

        it("check if provided e-mail address already exists & return status code 422", function (done) {
            this.timeout(6000);
            let user = new User({
                name: "Test",
                email: "test@mail.com",
                password: "1234567",
                confirmPassword: "1234567",
            });
            user.save((err, response) => {
                chai.request(server)
                    .post("/api/v1/auth/register")
                    .send({
                        name: "Test",
                        email: "test@mail.com",
                        password: "1234567",
                        confirmPassword: "1234567",
                    })
                    .end(function (err, res) {
                        //console.log(res);
                        const obj = JSON.parse(res.text);
                        expect(res).to.have.status(422);
                        expect(obj.error).to.have.string(
                            "Korisnik sa unetim e-mailom postoji"
                        );
                        done();
                    });
            });
        });

        it("check if returns token for provided valid e-mail address", async function () {
            this.timeout(10000);
            const user = {
                name: "Test",
                email: "test@mail.com",
                password: "1234567",
                confirmPassword: "1234567",
            };

            const result = await chai
                .request(server)
                .post("/api/v1/auth/register")
                .send(user);

            //console.log(result);
            expect(result).to.have.property("statusCode", 200);
            expect(result.body).to.have.property("success", true);
            expect(result.body)
                .to.have.property("token")
                .that.is.a("string")
                .have.length.above(10);
        });

    });

    describe("# User Login", function () {
        it("check if user email field is empty & return status code 400", function (done) {
            chai.request(server)
                .post("/api/v1/auth/login")
                .send({
                    email: "",
                    password: "12345678",
                })
                .end(function (err, res) {
                    //console.log(res);
                    expect(res).to.have.status(400);
                    const obj = JSON.parse(res.text);
                    expect(obj).to.deep.equal({
                        success: false,
                        error: "Unesite email i šifru",
                    });
                    done();
                });
        });

        it("check if password field is empty & return status code 400", function (done) {
            chai.request(server)
                .post("/api/v1/auth/login")
                .send({
                    email: "test@mail.com",
                    password: "",
                })
                .end(function (err, res) {
                    //console.log(res);
                    expect(res).to.have.status(400);
                    const obj = JSON.parse(res.text);
                    expect(obj).to.deep.equal({
                        success: false,
                        error: "Unesite email i šifru",
                    });
                    done();
                });
        });

        it("check if user with provided e-mail address axists & return status code 401 id doesn't", function (done) {
            this.timeout(6000);
            let user = new User({
                name: "Test",
                email: "test@mail.com",
                password: "1234567",
                confirmPassword: "1234567",
            });
            user.save((err, response) => {
                chai.request(server)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "wrongMail@mail.com",
                        password: "1234567",
                    })
                    .end(function (err, res) {
                        //console.log(res);
                        expect(res).to.have.status(401);
                        const obj = JSON.parse(res.text);
                        expect(obj).to.deep.equal({
                            success: false,
                            error:
                                "Pogrešno uneti podaci. Invalid credentials.",
                        });
                        done();
                    });
            });
        });

        it("check for password match & return status code 401 if they don't match", function (done) {
            this.timeout(6000);
            let user = new User({
                name: "Test",
                email: "test@mail.com",
                password: "1234567",
                confirmPassword: "1234567",
            });
            user.save((err, response) => {
                chai.request(server)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "test@mail.com",
                        password: "wrongPassword",
                    })
                    .end(function (err, res) {
                        //console.log(res);
                        expect(res).to.have.status(401);
                        const obj = JSON.parse(res.text);
                        expect(obj).to.deep.equal({
                            success: false,
                            error:
                                "Pogrešno uneti podaci. Invalid credentials.",
                        });
                        done();
                    });
            });
        });

        it("check if returns token after valid login", function (done) {
            this.timeout(6000);
            let user = new User({
                name: "Test",
                email: "test@mail.com",
                password: "1234567",
                confirmPassword: "1234567",
            });
            user.save((err, response) => {
                chai.request(server)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "test@mail.com",
                        password: "1234567",
                    })
                    .end(function (err, res) {
                        //console.log(res);
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("success", true);
                        expect(res.body)
                            .to.have.property("token")
                            .that.is.a("string")
                            .have.length.above(10);

                        done();
                    });
            });
        });

    });
    
    describe("# Get loged in user data", function () {

        before(async function() {
            await User.deleteMany({});
        })
        
        it("check for data about logged in user",async function () {
            this.timeout(6000);
            const user = {
                name: "Test",
                email: "test@mail.com",
                password: "1234567",
                confirmPassword: "1234567",
            };

            const respPost = await chai.request(server)
                    .post("/api/v1/auth/register")
                    .send(user);
                    
            //console.log(respPost);
            const token = respPost.body.token;
            const respGet = await chai.request(server)
                    .get("/api/v1/auth/me")
                    .set('Cookie', `token=${token}`);
            
            //console.log(respGet);
            expect(respGet).to.have.status(200);
            expect(respGet.body.data).to.have.property('name', user.name);
            expect(respGet.body.data).to.have.property('email', user.email);
            expect(respGet.body.data).to.have.property('role', 'user');
            expect(respGet.body.data).to.have.property('avatar', 'user/user-default.png');
           
        });

        after((done) => {
            mongoose.connection.close();
            done();
        });
    });
});
