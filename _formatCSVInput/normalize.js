const normalize = (products) => {

    return products.map(product => {

        const nazivProizvoda = product.proizvod.trim().split(' ').join('');
        //  napon
        if (product.napon !== "") {
            product.napon = product.napon.trim().split(' ').join('');
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} napon nije ubacen.`);
            product.napon = 'N/A';
        }

        //  ime proizvoda
        if (product.proizvod !== '') {
            product.proizvod = product.proizvod.trim();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} naziv proizvoda nije ubacen.`);
            product.proizvod = 'N/A';
        }

        //  boja
        if (product.boja !== "") {
            const boja = product.boja.trim().toLowerCase();
            switch (boja) {
                case 'schwarz': 
                    product.boja = 'crna';
                    break;

                case 'black': 
                    product.boja = 'crna';
                    break;

                case 'weiss': 
                    product.boja = 'siva';
                    break;

                case 'rot': 
                    product.boja = 'crvena';
                    break;

                default:
                    product.boja = product.boja.trim();    
            }
        } else {
            if (!nazivProizvoda.startsWith('H0')) {
                product.boja = 'crna';
            } else {
                product.boja = 'N/A';
            }
            //console.log(`Za sifru proizvoda ${product.sifra} boja nije ubacena.`);
        }

        // propis
        if (product.propis !== '') {
            product.propis = product.propis.trim();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} propis nije ubacen.`);
            product.propis = 'N/A';
        }

        // brojZica
        if (product.brojZica == '') {
            product.brojZica = 1;
        } 

        // precnik zice
        if (product.precnikZice !== '') {
            product.precnikZice = product.precnikZice.toString();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} precnikZice nije ubacen.`);
            product.precnikZice = '0.2';
        }

        // otpor provodnika
        if (product.otpor !== '') {
            product.otpor = product.otpor.toString();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} otpor nije ubacen.`);
            product.otpor = '12.1';
        }

        // debljina izolacije
        if (product.debIzolacije !== '') {
            product.debIzolacije = product.debIzolacije.toString();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} debIzolacije nije ubacen.`);
            product.debIzolacije = '1.00';
        }

        // debljina plasta
        if (product.debljinaPlasta !== '') {
            product.debPlasta = product.debljinaPlasta.toString();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} debljinaPlasta nije ubacen.`);

            if (product.proizvod.startsWith('NY')) {
                product.debPlasta = '1.80';
            } else if (nazivProizvoda.startsWith('PP-Y')) {
                product.debPlasta = '1.20';
            }
            else {
                product.debPlasta = '0';
            }
        }
        // obrisi propertie cije ime je promenjeno
        delete product.debljinaPlasta;

        // precnik kabla
        if (product.sPrecnik !== '') {
            product.spPrecnik = product.sPrecnik.toString();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} precnik nije ubacen.`);
            product.spPrecnik = '10.00';
        }
        // obrisi propertie cije ime je promenjeno
        delete product.sPrecnik;

        // ispitni napon
        if (product.ispitniNapon !== '') {
            product.ispitniNapon = product.ispitniNapon.toString();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} ispitniNapon nije ubacen.`);
            product.ispitniNapon = '0';
        }

        // debPPS1
        if (product.debPPS1 !== '' && product.debPPS1 !== 0) {
            product.debPPS1 = product.debPPS1.toString();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} debPPS1 nije ubacen.`);
            product.debPPS1 = '/';
        }

        // debPPS2
        if (product.debPPS2 !== '' && product.debPPS2 !== 0) {
            product.debPPS2 = product.debPPS2.toString();
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} debPPS2 nije ubacen.`);
            product.debPPS2 = '/';
        }

        // parcijalna
        if (product.parcijalna !== '' && product.parcijalna !== 0) {
            product.parcijalna = product.parcijalna.toString().split(' ').join('');
        } else {
            //console.log(`Za sifru proizvoda ${product.sifra} parcijalna nije ubacen.`);
            product.parcijalna = '/';
        }

        return product;
    });
};

module.exports = normalize;