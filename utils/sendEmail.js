const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config({
    path: "./config/config.env"
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (name, email) => {
    // ovo vraca promise, ali se svejedno moze vratiti i ovako jer izvrsenje sledeceg koda ne zavisi od ovoga, prakticno se izvrsava u paraleli
    try {
        sgMail.send({
            to: email,
            from: 'vladimir.nikodijevic@tfkable.com',
            subject: 'Prijava na platformu Reports',
            html: `<p>Poštovani ${name},</p>
                    <br>
                    <p> Dobrodošli na platformu Fabrike Kablova Zaječar za pravljenje Izveštaja.</p>
                    <br>
                    <p>Srdačan pozdrav!</p>
                    <p>Reports Team</p>
                    `
        })
        console.log(`Uspešno poslata poruka na adresu ${email}`.green);

        
    } catch (error) {
        console.log(`Poruka nije poslata na adresu ${email}`.red);
    }
}

const sendCancelEmail = (name, email) => {
    try {
        sgMail.send({
            to: email,
            from: 'vladimir.nikodijevic@tfkable.com',
            subject: 'Odjava sa platforme Reports',
            html: `<p>Poštovani ${name},</p> 
                    <br>
                    <p>Žao nam je što se odjavljujete sa platforme Fabrike Kablova Zaječar.</p>
                    <br>
                    <p>Srdačan pozdrav!</p>
                    <p>Reports Team</p>`
        })

        console.log(`Uspešno poslata poruka na adresu ${email}`.green);        
    } catch (error) {
        console.log(`Poruka nije poslata na adresu ${email}`.red);
    }
}

const sendResetPasswordEmail = async (name, email, link) => {
    // vraca se cela fja pa se greska hvata u controlleru jer cela controller fja zavisi od slanja linka
    return await sgMail.send({
        to: email,
        from: 'vladimir.nikodijevic@tfkable.com',
        subject: 'Link za resetovanje sifre',
        text: `Poštovani ${name}, U tekstu ispod, nalazi se link za reset zaboravljene šifre koji ste zahtevali. Potreban je PUT request. Link je validan u narednih 10 minuta!
        ${link}`
    })

}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail,
    sendResetPasswordEmail
};