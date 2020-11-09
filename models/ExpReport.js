const mongoose = require('mongoose');

const ExpReportSchema = new mongoose.Schema({
    rb: {
        type: Number,
        // required: [true, 'Unesite redni broj izveštaja']
    },
    
    sifra: {
        type: Number,
        required: [true, 'Unesite sifru proizvoda'],
        // validate: [lengthValidation(this.sifra, 7), 'Sifra mora da sadrzi 7 broja'] 
        validate: [function() {
            return this.sifra.toString().length === 7;
        } , 'Sifra mora da sadrzi 7 broja'] 
    },

    godina: {
        type: Number,
        required: [true, 'Unesite godinu proizvodnje kabla npr. 2020'],
        validate: [function() {
            return this.godina.toString().length === 4;
        } , 'Godina proizvodnje mora da sadrzi 4 broja']
    },
    
    dobos_1: {
        type: String,
        required: [true, 'Unesite broj na stranici doboša'],
        validate: [function() {
            return this.dobos_1.length >= 7 && this.dobos_1.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_1: {
        type: Number,
        required: [true, 'Unesite dužinu kabla'],
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },

    dobos_2: {
        type: String,
        validate: [function() {
            return this.dobos_2.length >= 7 && this.dobos_2.length <= 10;;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_2: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },  

    dobos_3: {
        type: String,
        validate: [function() {
            return this.dobos_3.length >= 7 && this.dobos_3.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_3: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },   

    dobos_4: {
        type: String,
        validate: [function() {
            return this.dobos_4.length >= 7 && this.dobos_4.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_4: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },   

    dobos_5: {
        type: String,
        validate: [function() {
            return this.dobos_5.length >= 7 && this.dobos_5.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_5: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },  

    dobos_6: {
        type: String,
        validate: [function() {
            return this.dobos_6.length >= 7 && this.dobos_6.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_6: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },  

    dobos_7: {
        type: String,
        validate: [function() {
            return this.dobos_7.length >= 7 && this.dobos_7.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_7: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    dobos_8: {
        type: String,
        validate: [function() {
            return this.dobos_8.length >= 7 && this.dobos_8.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_8: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },   

    dobos_9: {
        type: String,
        validate: [function() {
            return this.dobos_9.length >= 7 && this.dobos_9.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_9: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },  

    dobos_10: {
        type: String,
        validate: [function() {
            return this.dobos_10.length >= 7 && this.dobos_10.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_10: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    dobos_11: {
        type: String,
        validate: [function() {
            return this.dobos_11.length >= 7 && this.dobos_11.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_11: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },   

    dobos_12: {
        type: String,
        validate: [function() {
            return this.dobos_12.length >= 7 && this.dobos_12.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_12: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    dobos_13: {
        type: String,
        validate: [function() {
            return this.dobos_13.length >= 7 && this.dobos_13.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_13: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    dobos_14: {
        type: String,
        validate: [function() {
            return this.dobos_14.length >= 7 && this.dobos_14.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_14: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    }, 

    dobos_15: {
        type: String,
        validate: [function() {
            return this.dobos_15.length >= 7 && this.dobos_15.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_15: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    dobos_16: {
        type: String,
        validate: [function() {
            return this.dobos_16.length >= 7 && this.dobos_16.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_16: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },  

    dobos_17: {
        type: String,
        validate: [function() {
            return this.dobos_17.length >= 7 && this.dobos_17.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_17: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    dobos_18: {
        type: String,
        validate: [function() {
            return this.dobos_18.length >= 7 && this.dobos_18.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_18: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    dobos_19: {
        type: String,
        validate: [function() {
            return this.dobos_19.length >= 7 && this.dobos_19.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_19: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    dobos_20: {
        type: String,
        validate: [function() {
            return this.dobos_20.length >= 7 && this.dobos_20.length <= 10;
        } , 'Oznaka doboša mora da sadrzi 10 znaka']
    },

    duzina_20: {
        type: Number,
        min: [1, 'Najmanja dužina koju možete uneti je 1m'],
        max: [15000, 'Najveća dužina koju možete uneti je 15 000m']
    },    

    ukupnaDuz: {
        type: Number,
        required: true
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
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// expReports sadrzi sifru proizvoda i preko nje da se pozove i popuni ceo proizvod
// MORA PREKO VIRTUALS jer se pretrazuje preko polja SIFRA ,a ne _id

ExpReportSchema.virtual('proizvod', {
    // model iz kog se cupaju podaci
    ref: 'Product',
    // polje u DomReports
    localField: 'sifra',
    // polje u Product
    foreignField: 'sifra',
    justOne: true
});

module.exports = mongoose.model('ExpReport', ExpReportSchema);