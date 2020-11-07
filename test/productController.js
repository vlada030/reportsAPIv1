const chai = require("chai");
const expect = chai.expect;
const chaihttp = require("chai-http");
const mongoose = require("mongoose");

const server = require("../server");
const Product = require("../models/Product");
const User = require("../models/User");

chai.use(chaihttp);

describe("Integration test - Product Controller testing", function () {
    // ovo vazi za sve testove ovde, registruj korisnika i vrati token
    const user = {
        name: "Test",
        email: "test@mail.com",
        password: "1234567",
        confirmPassword: "1234567",
    };

    const product = {
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
        sifra: 1111111,
        otpor: "4.61",
    };

    let token;

    before(async function () {
        this.timeout(5000);
        await User.deleteMany({});
        await Product.deleteMany({});
        // user register
        let response = await chai
            .request(server)
            .post("/api/v1/auth/register")
            .send(user);
        //console.log(response);
        token = response.body.token;
    });

    describe("# Create product", function () {

        it("check endpoint if product code is less than 7 characters long & return status code 400", async function () {
            product.sifra = 123;
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra proizvoda mora da sadrži 7 broja; ",
            });
        });

        it("check endpoint if product code is more than 7 characters long & return status code 400", async function () {
            product.sifra = 12345678;
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Šifra proizvoda mora da sadrži 7 broja; ",
            });
        });

        it("check endpoint if product name is less than 2 characters long & return status code 400", async function () {
            product.sifra = 1111111;
            product.proizvod = "";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Naziv proizvoda sadrži od 2 do 45 slova / broja; ",
            });
        });

        it("check endpoint if product name is more than 45 characters long & return status code 400", async function () {
            product.proizvod =
                "longProductName longProductName longProductName ";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Naziv proizvoda sadrži od 2 do 45 slova / broja; ",
            });
        });

        it("check endpoint if product norm is less than 1 characters long & return status code 400", async function () {
            product.proizvod = "Proba";
            product.propis = "";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Naziv standarda sadrži najviše 40 slova / broja; ",
            });
        });

        it("check endpoint if product norm is more than 40 characters long & return status code 400", async function () {
            product.propis = "longProductNorm longProductNorm longProductNorm ";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Naziv standarda sadrži najviše 40 slova / broja; ",
            });
        });

        it("check endpoint if product wires count is 0 & return status code 400", async function () {
            product.propis = "SRPS + ZAHTEV KUPCA";
            product.brojZica = 0;
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Broj žica provodnika je u intervalu 1 - 2500; ",
            });
        });

        it("check endpoint if product wires count is more than 2500 & return status code 400", async function () {
            product.brojZica = 2501;
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Broj žica provodnika je u intervalu 1 - 2500; ",
            });
        });

        it("check endpoint if product single wire diameter is less than 0.2 & return status code 400", async function () {
            product.brojZica = 25;
            product.precnikZice = "0.1";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Prečnik žice komponente je u intervalu 0.2 - 3.75; ",
            });
        });

        it("check endpoint if product single wire diameter is more than 3.75 & return status code 400", async function () {
            product.precnikZice = "3.76";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Prečnik žice komponente je u intervalu 0.2 - 3.75; ",
            });
        });

        it("check endpoint if product core resistance is less than 0.01 & return status code 400", async function () {
            product.precnikZice = "0.4";
            product.otpor = "0.005";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Vrednost otpora mora da bude u granicama 0.01 - 24; ",
            });
        });

        it("check endpoint if product core resistance is more than 24 & return status code 400", async function () {
            product.otpor = "24.1";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Vrednost otpora mora da bude u granicama 0.01 - 24; ",
            });
        });

        it("check endpoint if product core insulation thickness is less than 0.1 & return status code 400", async function () {
            product.otpor = "4.61";
            product.debIzolacije = "0.05";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Debljina izolacije je u intervalu 0.1 - 9; ",
            });
        });

        it("check endpoint if product core insulation thickness is more than 9 & return status code 400", async function () {
            product.debIzolacije = "9.1";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Debljina izolacije je u intervalu 0.1 - 9; ",
            });
        });

        it("check endpoint if product core insulation thickness is negative number & return status code 400", async function () {
            product.debIzolacije = "0.9";
            product.debPlasta = "-4.61";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Debljina plašta je u intervalu 0 - 4; ",
            });
        });

        it("check endpoint if product core insulation thickness is more than 4 & return status code 400", async function () {
            product.debPlasta = "4.1";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Debljina plašta je u intervalu 0 - 4; ",
            });
        });

        it("check endpoint if product outer diameter is less than 2 & return status code 400", async function () {
            product.debPlasta = "1.2";
            product.spPrecnik = "1.9";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Spoljnji prečnik mora da bude u granicama 2 - 70; ",
            });
        });

        it("check endpoint if product outer diameter is more than 70 & return status code 400", async function () {
            product.spPrecnik = "70.1";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Spoljnji prečnik mora da bude u granicama 2 - 70; ",
            });
        });

        it("check endpoint if product is successufully saved & return status code 200", async function () {
            product.spPrecnik = "26.4";
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(201);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body.data.sifra).to.be.equal(1111111);
        });

        it("check endpoint if product with given product code already exists in database & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .post("/api/v1/products")
                .set("Cookie", `token=${token}`)
                .send(product);

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Proizvod sa ovom šifrom postoji, unesite drugu šifru; ",
            });
        });
    });

    describe("# Get product", function () {
        it("check if provided product code doesnt exist in database & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .get("/api/v1/products/1111112")
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(404);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Proizvod sa šifrom 1111112 nije pronađen",
            });
        });

        it("check if provided product code exists in database & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .get("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.have.property("success", true);
        });

    });

    describe("# Update product", function () {

        it("check endpoint if product with provided product code doesnt exist & return status code 404", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/notExists")
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(404);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Resource not found with id of notExists",
            });
        });

        it("check endpoint if product name is less than 2 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({proizvod: ''});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Naziv proizvoda sadrži od 2 do 45 slova / broja; ",
            });
        });

        it("check endpoint if product name is more than 45 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({proizvod:
                    "longProductName longProductName longProductName "});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Naziv proizvoda sadrži od 2 do 45 slova / broja; ",
            });
        });

        it("check endpoint if product norm is less than 1 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({propis: ""});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Naziv standarda sadrži najviše 40 slova / broja; ",
            });
        });

        it("check endpoint if product norm is more than 40 characters long & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({propis: "longProductNorm longProductNorm longProductNorm "});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Naziv standarda sadrži najviše 40 slova / broja; ",
            });
        });

        it("check endpoint if product wires count is 0 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({brojZica: "0"});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Broj žica provodnika je u intervalu 1 - 2500; ",
            });
        });

        it("check endpoint if product wires count is more than 2500 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({brojZica: "2501"});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Broj žica provodnika je u intervalu 1 - 2500; ",
            });
        });

        it("check endpoint if product single wire diameter is less than 0.2 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({precnikZice: '0.1'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Prečnik žice komponente je u intervalu 0.2 - 3.75; ",
            });
        });

        it("check endpoint if product single wire diameter is more than 3.75 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({precnikZice: '3.76'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Prečnik žice komponente je u intervalu 0.2 - 3.75; ",
            });
        });

        it("check endpoint if product core resistance is less than 0.01 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({otpor: '0.005'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Vrednost otpora mora da bude u granicama 0.01 - 24; ",
            });
        });

        it("check endpoint if product core resistance is more than 24 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({otpor: '24.1'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Vrednost otpora mora da bude u granicama 0.01 - 24; ",
            });
        });

        it("check endpoint if product core insulation thickness is less than 0.1 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({debIzolacije: '0.05'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Debljina izolacije je u intervalu 0.1 - 9; ",
            });
        });

        it("check endpoint if product core insulation thickness is more than 9 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({debIzolacije: '9.1'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Debljina izolacije je u intervalu 0.1 - 9; ",
            });
        });

        it("check endpoint if product core insulation thickness is negative number & return status code 400", async function () {

            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({debPlasta: '-4.61'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Debljina plašta je u intervalu 0 - 4; ",
            });
        });

        it("check endpoint if product core insulation thickness is more than 4 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({debPlasta: '4.1'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Debljina plašta je u intervalu 0 - 4; ",
            });
        });

        it("check endpoint if product outer diameter is less than 2 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({spPrecnik: '1.9'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Spoljnji prečnik mora da bude u granicama 2 - 70; ",
            });
        });

        it("check endpoint if product outer diameter is more than 70 & return status code 400", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({spPrecnik: '70.1'});

            //console.log(resp);
            expect(resp).to.have.status(400);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Spoljnji prečnik mora da bude u granicama 2 - 70; ",
            });
        });

        it("check endpoint if product is successufully updated & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .put("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`)
                .send({proizvod: 'Name successfully updated'});

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.have.property("success", true);
            expect(resp.body.data.proizvod).to.be.equal('Name successfully updated');
        });

    });
    
    describe('# Delete product', function() {
        it("check endpoint if product with provided product code doesnt exist & return status code 404", async function () {
            const resp = await chai
                .request(server)
                .delete("/api/v1/products/notExists")
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(404);
            expect(resp.body).to.be.deep.equal({
                success: false,
                error: "Resource not found with id of notExists",
            });
        });

        it("check endpoint if product is successufully deleted & return status code 200", async function () {
            const resp = await chai
                .request(server)
                .delete("/api/v1/products/1111111")
                .set("Cookie", `token=${token}`);

            //console.log(resp);
            expect(resp).to.have.status(200);
            expect(resp.body).to.be.deep.equal({success: true, data: 'Proizvod je uspešno obrisan'});
        });
        
        after((done) => {
            mongoose.connection.close();
            done();
        });
    })
});
