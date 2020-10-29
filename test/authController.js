const chai = require("chai");
const chaihttp = require("chai-http");
const expect = chai.expect;
const mongoose = require("mongoose");
const server = require("../server");

chai.use(chaihttp);

describe("Authentication controller testing", function () {
    describe("# User Registration", function () {
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

        it("check if repeteaded password doesnt match password & return status code 401", function (done) {
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

        afterEach((done) => {
            mongoose.connection.close(done);
        });
    });
});
