const fs = require('fs');
const dotenv = require('dotenv');
const colors = require('colors');
const mongoose = require('mongoose');

const Product = require('../models/Product');
const normalize = require('./normalize');

dotenv.config({
    path: './config/config.env'
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});



const importData = async () => {
    
    const products = JSON.parse(
        fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8')
    );
    console.log('Loaded products.json'.bgGreen);

    // normiraj podatke
    const normalizedProducts = normalize(products);

    // napravi kopiju na disku
    fs.writeFileSync(`${__dirname}/_data/normalizedProducts.json`, JSON.stringify(normalizedProducts, null, 4));
    console.log('Successfully created and writed normalizedProducts.json'.bgGreen);

    try {
        await Product.create(normalizedProducts);
        console.log('Data Imported'.bgGreen);
        process.exit();        
    } catch (err) {
        console.log(err);
    }

};

const deleteData = async () => {
   try {
       await Product.deleteMany();
       console.log('Data deleted'.bgRed);
       process.exit();       
   } catch (err) {
       console.log(err);
   }
    
};

if (process.argv[2]  === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}