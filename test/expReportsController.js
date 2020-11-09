const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");

const mongoose = require("mongoose");
const server = require("../server");
const User = require("../models/User");
const ExpReport = require("../models/ExpReport");

chai.use(chaiHttp);

describe("Integration test - Exp Reports controller testing", function () {
    const user = {
        name: "Test",
        email: "test@mail.com",
        password: "1234567",
        confirmPassword: "1234567",
    };

    const report = {
        _id: "5fa92e3db07e5308e0d1204e",
        sifra: 1111111,
        godina: 2020,
        duzina_1: 500,
        dobos_1: "090F50500N",
        duzina_2: 500,
        dobos_2: "090F50501N",
        ukupnaDuz: 1000,
    };

    let token;

    before(async function () {
        this.timeout(10000);
        await User.deleteMany({});
        await ExpReport.deleteMany({});
        // user register
        let response = await chai
            .request(server)
            .post("/api/v1/auth/register")
            .send(user);
        //console.log(response);
        token = response.body.token;
    });

    describe("# Create Exp Report", function () {
        it("check endpoint if report product code is less than 7 characters long & return status code 400", async function () {
            report.sifra = 123;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra se sastoji od 7 cifara; ",
            });
        });

        it("check endpoint if report product code is more than 7 characters long & return status code 400", async function () {
            report.sifra = 12345678;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra se sastoji od 7 cifara; ",
            });
        });

        it("check endpoint if report product code value is not a number & return status code 400", async function () {
            report.sifra = "notNumb";
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra se sastoji od 7 cifara; ",
            });
        });

        it("check endpoint if report product manufacture year length is less than 4 characters long & return status code 400", async function () {
            report.sifra = 1111111;
            report.godina = 12;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Godina sadrži 4 cifre; ",
            });
        });

        it("check endpoint if report product manufacture year length is more than 4 characters long & return status code 400", async function () {
            report.godina = 12345678;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Godina sadrži 4 cifre; ",
            });
        });

        it("check endpoint if report product manufacture year value is not a number & return status code 400", async function () {
            report.godina = "notNumber";
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Godina sadrži 4 cifre; ",
            });
        });

        it("check endpoint if report product drum number is less than 7 characters long & return status code 400", async function () {
            report.godina = 2020;
            report.dobos_1 = "123456";
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Broj na stranici ili MIS Broj doboša može imati 7 - 10 karaktera; ",
            });
        });

        it("check endpoint if report product drum number is more than 10 characters long & return status code 400", async function () {
            report.dobos_1 = "1234567891011";
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Broj na stranici ili MIS Broj doboša može imati 7 - 10 karaktera; ",
            });
        });

        it("check endpoint if report product drum length value is less than 1 & return status code 400", async function () {
            report.dobos_1 = "090F50500N";
            report.duzina_1 = 0;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 15000m; ",
            });
        });

        it("check endpoint if report product drum length value is more than 15000 & return status code 400", async function () {
            report.duzina_1 = 15001;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 15000m; ",
            });
        });

        it("check endpoint if report product drum_1 length value is less than 1 & product drum_2 length value is less than 1 & return status code 400", async function () {
            report.duzina_1 = 500;
            report.duzina_2 = 0;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 15000m; ",
            });
        });

        it("check endpoint for valid report data, create report & return status code 201", async function () {
            report.duzina_2 = 500;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/exp")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(201);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body.data).to.have.property("sifra", 1111111);
        });
    });

    describe("# Read Exp Report from database", function () {
        it("check endpoint if report with provided id doesnt exist in the database & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .get(`/api/v1/reports/exp/4fa92e3db07e5308e0d1204e`)
                .set("Cookie", `token=${token}`);

            expect(resp).to.have.status(404);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Izveštaj sa id brojem 4fa92e3db07e5308e0d1204e ne postoji",
            });
        });

        it("check endpoint for valid report id, get report & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .get(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body.data).to.have.property("sifra", 1111111);
        });
    });

    describe("# Update Exp Report", function () {
        it("check endpoint if report product code is less than 7 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ sifra: 123 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra se sastoji od 7 cifara; ",
            });
        });

        it("check endpoint if report product code is more than 7 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ sifra: 12345678 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra se sastoji od 7 cifara; ",
            });
        });

        it("check endpoint if report product code value is not a number & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ sifra: "notNumb" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra se sastoji od 7 cifara; ",
            });
        });

        it("check endpoint if report product manufacture year length is less than 4 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ godina: 12 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Godina sadrži 4 cifre; ",
            });
        });

        it("check endpoint if report product manufacture year length is more than 4 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ godina: 12345678 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Godina sadrži 4 cifre; ",
            });
        });

        it("check endpoint if report product manufacture year value is not a number & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ godina: "notNumber" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Godina sadrži 4 cifre; ",
            });
        });

        it("check endpoint if report product drum number is less than 7 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ dobos_1: "123456" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Broj na stranici ili MIS Broj doboša može imati 7 - 10 karaktera; ",
            });
        });

        it("check endpoint if report product drum number is more than 10 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ dobos_1: "1234567891011" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Broj na stranici ili MIS Broj doboša može imati 7 - 10 karaktera; ",
            });
        });

        it("check endpoint if report product drum length value is less than 1 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ duzina_1: 0 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 15000m; ",
            });
        });

        it("check endpoint if report product drum length value is more than 15000 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ duzina_1: 15001 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 15000m; ",
            });
        });

        it("check endpoint if report product drum_1 length value is less than 1 & product drum_2 length value is less than 1 & return status code 400", async function () {
            report.duzina_1 = 500;
            report.duzina_2 = 0;
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ duzina_1: 500, duzina_2: 0 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 15000m; ",
            });
        });

        it("check endpoint for valid report data, create report & return status code 201", async function () {
            report.duzina_2 = 500;
            const resp = await chai
                .request(server)
                .put(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`)
                .send({ godina: 2000 });

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body.data).to.have.property("godina", 2000);
        });
    });

    describe("# Delete User Report", function () {
        it("check endpoint if report id number doesnt exist in the datatabase & return status code 404", async function () {
            const resp = await chai
                .request(server)
                .delete("/api/v1/reports/exp/4fa92e3db07e5308e0d1204e")
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(404);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Izveštaj sa id brojem 4fa92e3db07e5308e0d1204e ne postoji",
            });
        });

        it("check endpoint for successfull report delete & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .delete(`/api/v1/reports/exp/${report._id}`)
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.be.deep.equal({
                success: true,
                data: "Izveštaj uspešno obrisan.",
            });
        });

        after((done) => {
            mongoose.connection.close();
            done();
        });
    });
});
