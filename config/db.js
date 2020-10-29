const mongoose = require('mongoose');
// moze i ovde da se kreira try/catch u slucaju greske, ali bolje je u glavnom fajlu
// gde se poziva konekcija jer ce to ujedno da bude i globalni handler za Unhandled Rejection!
const connectDB = async () => {
    const mongoURI = process.env.NODE_ENV !== 'test' ? process.env.MONGO_URI_PROD_DEV : process.env.MONGO_URI_TEST;

    const conn = await mongoose.connect(mongoURI, {
        // ovo se ubacuje da nam nebi u konzoli izbacivalo upozorenja
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    if (process.env.NODE_ENV !== 'test') {
        console.log(`MongoDB Connected: ${conn.connection.host}`.brightBlue);
    }
}
//     // moze i ovako
//     await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true
//     });

//     console.log(`MongoDB Connected: ${mongoose.connection.host}`.brightBlue);
// }

module.exports = connectDB;