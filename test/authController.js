const chai = require("chai");
const chaihttp = require("chai-http");
const expect = chai.expect;

const mongoose = require("mongoose");
const fs = require('fs');
const User = require("../models/User");
const server = require("../server");
const authController = require("../controllers/authController");

chai.use(chaihttp);

describe("Authentication controller testing", function () {
    describe("# User Registration", function () {
        beforeEach(async function () {
            await User.deleteMany({});
        });

        it("check endpoint if user name field is empty & return status code 401", function (done) {
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

        it("check endpoint if user name is longer than 15 characters & return status code 401", async function () {
            let res = await chai
                .request(server)
                .post("/api/v1/auth/register")
                .send({
                    name: "longerThan15Characters",
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

        it("check endpoint if email field is empty & return status code 401", function (done) {
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

        it("check endpoint if email is invalid & return status code 401", function (done) {
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

        it("check endpoint if password has less than 7 characters & return status code 401", function (done) {
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

        it("check endpoint if password has more than 15 characters & return status code 401", function (done) {
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

        it("check endpoint if password has non Alphanumeric characters & return status code 401", function (done) {
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

        it("check endpoint if repeteaded password doesn't match password & return status code 401", function (done) {
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

        it("check endpoint if provided e-mail address already exists & return status code 422", function (done) {
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

        it("check endpoint if returns token for provided valid e-mail address", async function () {
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
                .and.have.length.above(10);
        });
    });

    describe("# User Login", function () {
        it("check endpoint if user email field is empty & return status code 400", function (done) {
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

        it("check endpoint if password field is empty & return status code 400", function (done) {
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

        it("check endpoint if user with provided e-mail address axists & return status code 401 id doesn't", function (done) {
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

        it("check endpoint for password match & return status code 401 if they don't match", function (done) {
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

        it("check endpoint if returns token after valid login", function (done) {
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

    describe("# Get logged in user data", function () {
        before(async function () {
            await User.deleteMany({});
        });

        it("check endpoint for data about logged in user", async function () {
            this.timeout(6000);
            const user = {
                name: "Test",
                email: "test@mail.com",
                password: "1234567",
                confirmPassword: "1234567",
            };

            const respPost = await chai
                .request(server)
                .post("/api/v1/auth/register")
                .send(user);

            //console.log(respPost);
            const token = respPost.body.token;
            const respGet = await chai
                .request(server)
                .get("/api/v1/auth/me")
                .set("Cookie", `token=${token}`);

            //console.log(respGet);
            expect(respGet).to.have.status(200);
            expect(respGet.body.data).to.have.property("name", user.name);
            expect(respGet.body.data).to.have.property("email", user.email);
            expect(respGet.body.data).to.have.property("role", "user");
            expect(respGet.body.data).to.have.property(
                "avatar",
                "user/user-default.png"
            );
        });
    });

    describe("# User name and email update", function () {
        const user = {
            name: "Test",
            email: "test@mail.com",
            password: "1234567",
            confirmPassword: "1234567",
        };

        let token;

        before(async function () {
            await User.deleteMany({});
            const resp = await chai
                .request(server)
                .post("/api/v1/auth/register")
                .send(user);

            //console.log(resp);
            token = resp.body.token;
        });

        it("check endpoint if new ( updated ) user name is not empty & return status code 400", async function () {
            this.timeout(6000);

            const resp = await chai
                .request(server)
                .put("/api/v1/auth/update")
                .set("Cookie", `token=${token}`)
                .send({ name: "" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Korisničko ime može sadržati najviše 15 karaktera, a najmanje jedan.; ",
            });
        });

        it("check endpoint if new ( updated ) user name is not longer than 15 characters & return status code 400", async function () {
            this.timeout(6000);

            const resp = await chai
                .request(server)
                .put("/api/v1/auth/update")
                .set("Cookie", `token=${token}`)
                .send({ name: "longerThan15Characters" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Korisničko ime može sadržati najviše 15 karaktera, a najmanje jedan.; ",
            });
        });

        it("check endpoint if new ( updated ) user email address is valid & return status code 400", async function () {
            this.timeout(6000);

            const resp = await chai
                .request(server)
                .put("/api/v1/auth/update")
                .set("Cookie", `token=${token}`)
                .send({ email: "testmail.com" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Unesite ispravnu email adresu; ",
            });
        });

        it("check endpoint if endpoint returns valid updated user data & status code", async function () {
            this.timeout(6000);
            const updatedUser = { name: "Pera", email: "pera@mail.com" };
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/update")
                .set("Cookie", `token=${token}`)
                .send(updatedUser);

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body.data).to.deep.include(updatedUser);
        });
    });

    describe("# User password change", function () {
        const user = {
            name: "Test",
            email: "test@mail.com",
            password: "1234567",
            confirmPassword: "1234567",
        };

        let token;

        before(async function () {
            await User.deleteMany({});
            const resp = await chai
                .request(server)
                .post("/api/v1/auth/register")
                .send(user);

            //console.log(resp);
            token = resp.body.token;
        });

        it("check endpoint if new password is shorter than 7 characters & return status code 400", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/updatepassword")
                .set("Cookie", `token=${token}`)
                .send({ newPassword: "short" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Šifra treba da sadrži slova i brojeve, 7 - 15 karaktera; ",
            });
        });

        it("check endpoint if new password is longer than 15 characters & return status code 400", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/updatepassword")
                .set("Cookie", `token=${token}`)
                .send({ newPassword: "longerThan15Characters" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Šifra treba da sadrži slova i brojeve, 7 - 15 karaktera; ",
            });
        });

        it("check endpoint if new password is valid but current password is incorect & return status code 401", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/updatepassword")
                .set("Cookie", `token=${token}`)
                .send({ currentPassword: "123456", newPassword: "12345678" });

            //console.log(resp);
            expect(resp).to.have.status(401);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Unesite ispravnu sadašnju šifru",
            });
        });

        it("check endpoint for token response & return status code 200", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/updatepassword")
                .set("Cookie", `token=${token}`)
                .send({ currentPassword: "1234567", newPassword: "12345678" });

            //console.log(resp);
            expect(resp).to.have.property("statusCode", 200);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body)
                .to.have.property("token")
                .that.is.a("string")
                .and.have.length.above(10);
            expect(resp.body.token).to.not.equal(token);
        });
    });

    describe("# User reset password link ", function () {
        // User already persist in the database, saved in previous test

        it("check endpoint if provided email doesnt exist in database & return status code 404", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .post("/api/v1/auth/resetpassword")
                .send({ email: "notExisting@mail.com" });

            //console.log(resp);
            expect(resp).to.have.status(404);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Ne postoji korisnik sa tom e-mail adresom!",
            });
        });

        it("check endpoint if reset password link is sent to users email & return status code 200", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .post("/api/v1/auth/resetpassword")
                .send({ email: "test@mail.com" });

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.be.deep.equal({
                success: true,
                data: "Email sent",
            });
        });
    });

    describe("# User reset password over reset link ", function () {
        // User already persist in the database, saved in previous test

        it("check endpoint if provided password is shorter than 7 characters & return status code 400", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/resetpassword/tokenPlaceholder")
                .send({ password: "123" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Šifra treba da sadrži slova i brojeve, 7 - 15 karaktera; ",
            });
        });

        it("check endpoint if provided password is longer than 15 characters & return status code 400", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/resetpassword/tokenPlaceholder")
                .send({ password: "longerthan15Characters" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Šifra treba da sadrži slova i brojeve, 7 - 15 karaktera; ",
            });
        });

        it("check endpoint if provided reset token isnt valid & return status code 404", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/resetpassword/tokenPlaceholder")
                .send({ password: "validPass" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Neispravan token. Obratite pažnju da imate 10 minuta od momenta pristizanja emaila da resetujete zaboravljenu šifru.",
            });
        });
    });

    describe.only("# Update user avatar", function () {

        const user = {
            name: "Test",
            email: "test@mail.com",
            password: "1234567",
            confirmPassword: "1234567",
        };

        let token;

        before(async function () {
            await User.deleteMany({});
            const resp = await chai
                .request(server)
                .post("/api/v1/auth/register")
                .send(user);

            //console.log(resp);
            token = resp.body.token;
        });

        it("check endpoint if no avatar image is present & return status code 400", async function () {
            this.timeout(6000);
            const resp = await chai
                .request(server)
                .put("/api/v1/auth/avatar")
                .set("Cookie", `token=${token}`)
                
            console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Niste izabrali avatar sliku",
            });
        });
    });
    after((done) => {
        mongoose.connection.close();
        done();
    });
});
