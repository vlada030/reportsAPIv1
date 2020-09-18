const mongoose = require('mongoose');

const shiftReportsSchema = new mongoose.Schema({
    smena: {
        type: String,
        enum: ['prva', 'druga'],
        default: 'prva'
    },

    pr1_0: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_1: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_2: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_3: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_4: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_5: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_6: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_7: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_8: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_9: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_10: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr1_11: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [2000, 'Najveci broj je 2000']
    },

    pr2_0: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_1: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_2: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_3: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_4: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_5: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_6: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_7: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_8: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_9: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_10: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pr2_11: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [2000, 'Najveci broj je 2000']
    },

    pak_0: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_1: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_2: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_3: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_4: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_5: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_6: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_7: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_8: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_9: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_10: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pak_11: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [2000, 'Najveci broj je 2000']
    },

    kor_0: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_1: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_2: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_3: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_4: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_5: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_6: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_7: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_8: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_9: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_10: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    kor_11: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [2000, 'Najveci broj je 2000']
    },

    pp_0: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_1: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_2: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_3: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_4: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_5: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_6: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_7: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_8: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_9: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_10: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    pp_11: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [2000, 'Najveci broj je 2000']
    },

    tel_0: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_1: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_2: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_3: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_4: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_5: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_6: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_7: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_8: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_9: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_10: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [200, 'Najveci broj je 300']
    },

    tel_11: {
        type: Number,
        min: [1, 'Najmanji broj je 1'],
        max: [2000, 'Najveci broj je 2000']
    },

    radnik1_ime : {
        type: String
    },

    radnik1_k: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik1_r: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik1_d: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik1_0: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [12, 'Najveca vrednost je 12 sati']
    },

    radnik1_1: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_2: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_3: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_4: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_5: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_6: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_7: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_8: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_9: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [200, 'Najveca vrednost je 100']
    },

    radnik1_10: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [2000, 'Najveca vrednost je 100']
    },

    radnik1_11: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [2000, 'Najveca vrednost je 100']
    },

    radnik2_ime : {
        type: String
    },

    radnik2_k: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik2_r: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik2_d: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik2_vreme: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [12, 'Najveca vrednost je 12 sati']
    },

    radnik2_nap: {
        type: String,
        maxlength: [150, 'Napomena ne moze da bude duza od 150 karaktera']
    },

    radnik3_ime : {
        type: String
    },

    radnik3_k: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik3_r: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik3_d: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik3_vreme: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [12, 'Najveca vrednost je 12 sati']
    },

    radnik3_nap: {
        type: String,
        maxlength: [150, 'Napomena ne moze da bude duza od 150 karaktera']
    },

    radnik4_ime : {
        type: String
    },

    radnik4_k: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik4_r: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik4_d: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik4_vreme: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [12, 'Najveca vrednost je 12 sati']
    },

    radnik4_nap: {
        type: String,
        maxlength: [150, 'Napomena ne moze da bude duza od 150 karaktera']
    },

    radnik5_ime : {
        type: String
    },

    radnik5_k: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik5_r: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik5_d: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik5_vreme: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [12, 'Najveca vrednost je 12 sati']
    },

    radnik5_nap: {
        type: String,
        maxlength: [150, 'Napomena ne moze da bude duza od 150 karaktera']
    },

    radnik6_ime : {
        type: String
    },

    radnik6_k: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik6_r: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik6_d: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik6_vreme: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [12, 'Najveca vrednost je 12 sati']
    },

    radnik6_nap: {
        type: String,
        maxlength: [150, 'Napomena ne moze da bude duza od 150 karaktera']
    },

    radnik7_ime : {
        type: String
    },

    radnik7_k: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik7_r: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik7_d: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik7_vreme: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [12, 'Najveca vrednost je 12 sati']
    },

    radnik7_nap: {
        type: String,
        maxlength: [150, 'Napomena ne moze da bude duza od 150 karaktera']
    },

    radnik8_ime : {
        type: String
    },

    radnik8_k: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik8_r: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik8_d: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [100, 'Najveca vrednost je 100']
    },

    radnik8_vreme: {
        type: Number,
        min: [0, 'Broj ne moze biti negativan'],
        max: [12, 'Najveca vrednost je 12 sati']
    },

    radnik8_nap: {
        type: String,
        maxlength: [150, 'Napomena ne moze da bude duza od 150 karaktera']
    },

    dorada1_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada1_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada1_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada1_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada2_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada2_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada2_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada2_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada3_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada3_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada3_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada3_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada4_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada4_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada4_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada4_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada5_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada5_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada5_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada5_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada6_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada6_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada6_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada6_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada7_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada7_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada7_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada7_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada8_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada8_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada8_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada8_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada9_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada9_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada9_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada9_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    dorada10_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    dorada10_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    dorada10_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']
    },

    dorada10_nap: {
        type: String,
        trim: true,
        maxlength: [100, 'Napomena sadrzi najvise 8 cifre']
    },

    proboj1_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    proboj1_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    proboj1_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']       
    },

    proboj1_nap: {
        type: String,
        trim: true,
        maxlength: [250, 'Polje napomena sadrzi najvise 250 karaktera']
    },

    proboj2_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    proboj2_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    proboj2_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']       
    },

    proboj2_nap: {
        type: String,
        trim: true,
        maxlength: [250, 'Polje napomena sadrzi najvise 250 karaktera']
    },

    proboj3_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    proboj3_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    proboj3_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']       
    },

    proboj3_nap: {
        type: String,
        trim: true,
        maxlength: [250, 'Polje napomena sadrzi najvise 250 karaktera']
    },

    proboj4_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    proboj4_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    proboj4_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']       
    },

    proboj4_nap: {
        type: String,
        trim: true,
        maxlength: [250, 'Polje napomena sadrzi najvise 250 karaktera']
    },

    proboj5_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    proboj5_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    proboj5_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']       
    },

    proboj5_nap: {
        type: String,
        trim: true,
        maxlength: [250, 'Polje napomena sadrzi najvise 250 karaktera']
    },

    proboj6_rn: {
        type: Number,
        maxlength: [8, 'Radni nalog sadrzi najvise 8 cifre']
    },

    proboj6_proizvod: {
        type: String,
        trim: true,
        maxlength: [100, 'Naziv proizvoda sadrzi najvise 100 karaktera']
    },

    proboj6_duz: {
        type: Number,
        maxlength: [5, 'Pojedinacna duzina proizvoda sadrzi najvise 5 cifre']       
    },

    proboj6_nap: {
        type: String,
        trim: true,
        maxlength: [250, 'Polje napomena sadrzi najvise 250 karaktera']
    },

    createdByUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    updatedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('ShiftReport', shiftReportsSchema);