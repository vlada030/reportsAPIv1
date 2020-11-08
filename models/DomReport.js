const mongoose = require('mongoose');

const DomReportSchema = new mongoose.Schema({
    rb: {
        type: Number,
        // required: [true, 'Unesite redni broj izveštaja']
    },
    
    MISBroj: {
        type: Number,
        unique: true,
        required: [true, 'Unesite MIS broj doboša'],
        // validate: [lengthValidation(this.MISBroj, 7), 'MIS broj mora da sadrzi 8 broja'] 
        validate: [function() {
            return this.MISBroj.toString().length === 7;
        } , 'MIS broj mora da sadrzi 7 broja'] 
    },

    sifra: {
        type: mongoose.Schema.Types.Number,
        required: [true, 'Unesite sifru proizvoda'],
        //validate: [lengthValidation(this.sifra, 7), 'Sifra mora da sadrzi 7 broja'] 
        validate: [function() {
            return this.sifra.toString().length === 7;
        } , 'Sifra mora da sadrzi 7 broja']
    },

    radniNalog: {
        type: Number,
        required: [true, 'Unesite radni nalog proizvoda'],
        // validate: [lengthValidation(this.radniNalog, 8), 'Radni nalog mora da sadrzi 8 broja'] 
        validate: [function() {
            return this.radniNalog.toString().length === 8;
        } , 'Radni Nalog mora da sadrzi 8 broja']      
    },

    velDob: {
        type: String,
        required: [true, 'Unesite veličinu doboša'],
        trim: true,
        maxlength: [7, 'Najduži string za oznaku velicine dobosa je 7 karaktera'],
    },

    duzina: {
        type: Number,
        required: true,
        min: 1,
        max: 3000
    },

    bruto: {
        type: Number,
        required: true,
        min: 1,
        max: 6000
    },

    neto: {
        type: Number,
        required: true,
        min: 1,
        max: 5000
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

// domReports sadrzi sifru proizvoda i preko nje da se pozove i popuni ceo proizvod
// MORA PREKO VIRTUALS jer se pretrazuje preko polja SIFRA ,a ne _id

DomReportSchema.virtual('proizvod', {
    // model iz kog se cupaju podaci
    ref: 'Product',
    // polje u DomReports
    localField: 'sifra',
    // polje u Product
    foreignField: 'sifra',
    justOne: true
});

module.exports = mongoose.model('DomReport', DomReportSchema);