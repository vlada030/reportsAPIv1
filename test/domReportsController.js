const { use } = require("chai");
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");

const server = require("../server");
const User = require("../models/User");
const Product = require("../models/Product");
const DomReport = require("../models/DomReport");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("Integration test - Dom Reports controller testing", function () {
    const user = {
        name: "Test",
        email: "test@mail.com",
        password: "1234567",
        confirmPassword: "1234567",
    };

    const product = {
        sifra: 1111111,
        proizvod: "proba",
        napon: "0.6/1kV",
        boja: "bela",
        propis: "SRPS + ZAHTEV KUPCA",
        brojZica: 25,
        precnikZice: "0.2",
        debPlasta: "0.123568",
        ispitniNapon: "2",
        spPrecnik: "25",
        debPlasta: "2",
        debIzolacije: "2",
        otpor: "4.61",
    };

    const report = {
        sifra: 1111111,
        radniNalog: 12345678,
        MISBroj: 1234567,
        duzina: 499,
        bruto: 5500,
        neto: 3000,
        velDob: "TK08AT",
    };

    let token;

    before(async function () {
        this.timeout(10000);
        await User.deleteMany({});
        await Product.deleteMany({});
        await DomReport.deleteMany({});
        // user register
        let response = await chai
            .request(server)
            .post("/api/v1/auth/register")
            .send(user);
        //console.log(response);
        token = response.body.token;
        // create product
        await chai
            .request(server)
            .post("/api/v1/products")
            .set("Cookie", `token=${token}`)
            .send(product);
    });

    describe("# Create Dom Report", function () {
        it("check endpoint if report product code is less than 7 characters long & return status code 400", async function () {
            report.sifra = 123;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
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
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra se sastoji od 7 cifara; ",
            });
        });

        it("check endpoint if report work order is less than 8 characters long & return status code 400", async function () {
            report.sifra = 1111111;
            report.radniNalog = 12;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Radni nalog sastoji se od 8 cifara; ",
            });
        });

        it("check endpoint if report work order is more than 8 characters long & return status code 400", async function () {
            report.radniNalog = 123456789;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Radni nalog sastoji se od 8 cifara; ",
            });
        });

        it("check endpoint if report MIS number is less than 7 characters long & return status code 400", async function () {
            report.radniNalog = 12345678;
            report.MISBroj = 12;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "MIS broj sastoji se od 7 cifara; ",
            });
        });

        it("check endpoint if report MIS number is more than 7 characters long & return status code 400", async function () {
            report.MISBroj = 12345678;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "MIS broj sastoji se od 7 cifara; ",
            });
        });

        it("check endpoint if report cable length value is less than 1 & return status code 400", async function () {
            report.MISBroj = 1234567;
            report.duzina = 0;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 3000m; ",
            });
        });

        it("check endpoint if report cable length value is more than 3000 & return status code 400", async function () {
            report.duzina = 3001;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 3000m; ",
            });
        });

        it("check endpoint if report cable drum size mark is omitted & return status code 400", async function () {
            report.duzina = 100;
            report.velDob = "";
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "String ne duzi od 7 karaktera; ",
            });
        });

        it("check endpoint if report cable drum size mark is more than 7 characters & return status code 400", async function () {
            report.velDob = "TK080TTT";
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "String ne duzi od 7 karaktera; ",
            });
        });

        it("check endpoint if report cable neto weight value is less than 1 & return status code 400", async function () {
            report.velDob = "TK080T";
            report.neto = 0;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja težina je 1kg, a najveća 5000kg; ",
            });
        });

        it("check endpoint if report cable neto weight value is more than 5000 & return status code 400", async function () {
            report.neto = 5001;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja težina je 1kg, a najveća 5000kg; ",
            });
        });

        it("check endpoint if report cable bruto weight value is less than 1 && also if neto value is greater than bruto value & return status code 400", async function () {
            report.neto = 100;
            report.bruto = 0;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error:
                    "Najmanja težina je 1kg, a najveća 6000kg; Bruto težina mora da bude veća od neto težine; ",
            });
        });

        it("check endpoint if report cable bruto weight value is more than 6000 & return status code 400", async function () {
            report.bruto = 6001;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja težina je 1kg, a najveća 6000kg; ",
            });
        });

        it("check endpoint for valid report data, create report & return status code 201", async function () {
            report.bruto = 2000;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(201);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body.data).to.have.property("sifra", 1111111);
        });

        it("check endpoint if report MIS Number already exists in the database & return status code 400", async function () {
            report.MISNumber = 1234567;
            const resp = await chai
                .request(server)
                .post("/api/v1/reports/dom")
                .set("Cookie", `token=${token}`)
                .send(report);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Izveštaj pod ovim MIS brojem postoji!; ",
            });
        });
    });

    describe("# Read Dom Report from database", function () {
        it("check endpoint if report MIS number doesnt exist in the database & return status code 404", async function () {
            const resp = await chai
                .request(server)
                .get("/api/v1/reports/dom/notExists")
                .set("Cookie", `token=${token}`);

            expect(resp).to.have.status(404);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Resource not found with id of notExists",
            });
        });

        it("check endpoint for valid report MIS number, get report & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .get("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body.data).to.have.property("sifra", 1111111);
        });
    });

    describe("# Update Dom Report", function () {
        it("check endpoint if report MIS Number exists in the database & return status code 404", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/12345678")
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(404);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Izveštaj sa MIS brojem 12345678 ne postoji",
            });
        });

        it("check endpoint if report product code is less than 7 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ sifra: 111 });

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
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ sifra: 11111118 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra se sastoji od 7 cifara; ",
            });
        });

        it("check endpoint if report work order is less than 8 characters long & return status code 400", async function () {
            report.radniNalog = 12;
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ radniNalog: 123 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Radni nalog sastoji se od 8 cifara; ",
            });
        });

        it("check endpoint if report work order is more than 8 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ radniNalog: 123456789 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Radni nalog sastoji se od 8 cifara; ",
            });
        });

        it("check endpoint if report cable length value is less than 1 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ duzina: 0 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 3000m; ",
            });
        });

        it("check endpoint if report cable length value is more than 3000 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ duzina: 3001 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja dužina je 1m, a najveća 3000m; ",
            });
        });

        it("check endpoint if report cable drum size mark is omitted & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ velDob: "" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "String ne duzi od 7 karaktera; ",
            });
        });

        it("check endpoint if report cable drum size mark is more than 7 characters & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ velDob: "TK080TTTT" });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "String ne duzi od 7 karaktera; ",
            });
        });

        it("check endpoint if report cable neto weight value is less than 1 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ neto: 0 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja težina je 1kg, a najveća 5000kg; ",
            });
        });

        it("check endpoint if report cable neto weight value is more than 5000 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ neto: 5001 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja težina je 1kg, a najveća 5000kg; ",
            });
        });

        it("check endpoint if report cable bruto weight value is less than 1 && also if neto value is greater than bruto value & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ bruto: 0 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja težina je 1kg, a najveća 6000kg; ",
            });
        });

        it("check endpoint if report cable bruto weight value is less than neto value - case#1 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ bruto: 10 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Bruto težina mora da bude veća od neto težine; ",
            });
        });

        it("check endpoint if report cable bruto weight value is less than neto value - case#2 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ bruto: 10, neto: 200 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Bruto težina mora da bude veća od neto težine; ",
            });
        });

        it("check endpoint if report cable bruto weight value is more than 6000 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ bruto: 6001 });

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Najmanja težina je 1kg, a najveća 6000kg; ",
            });
        });

        it("check endpoint for valid report data, update report & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`)
                .send({ duzina: 1234 });

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body.data).to.have.property("duzina", 1234);
        });
    });
    
    describe('# Delete User Report', function() {
        
        it("check endpoint if report MIS Number soent exist in the datatabase & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .delete("/api/v1/reports/dom/12345678")
                .set("Cookie", `token=${token}`);
    
            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Izveštaj sa MIS brojem 12345678 ne postoji",
            });
        });

        it("check endpoint for successfull report delete & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .delete("/api/v1/reports/dom/1234567")
                .set("Cookie", `token=${token}`);
    
            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.be.deep.equal({
                success: true,
                data: "Izveštaj uspešno obrisan."
            });
        });
        
        after((done) => {
            mongoose.connection.close();
            done();
        });
    })
});
