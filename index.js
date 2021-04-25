import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import fs from 'fs';
import model from './lib/models.js';
import sendEmail from './lib/mailer.js';
import initEmail from './lib/initEmail.js';
import validateEmail from './lib/validateEmail.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.engine('hbs', handlebars({extname:'.hbs', defaultLayout: 'index.hbs'}) );
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/listar', async (req,res) => {
    const products = await model.product.find({}, (err) => {
        if(err) throw new Error(`Reading error: ${err}`);
    }).lean();// using .lean() to get a json object (instead of a mongoose one)
    console.log('Sending collection to /listar\n');
    res.render('listar', {products});
});

app.get('/set-correo', (req,res) => {
    res.sendFile(process.cwd() + '/public/set-correo.html');
});

app.post('/ingreso', (req,res) => {
    const newProduct = new model.product(req.body);
    newProduct.save(async err => {
        if(err) throw new Error(`Writing error: ${err}`);
        console.log('New product added to database\n');
        res.redirect('/');
        //=> Consulting collection length to send email
        const products = await model.product.find({}, (err) => {
            if(err) throw new Error(`Reading error: ${err}`);
        }).lean();
        if(products.length%10 === 0) sendEmail(products);
    });
});

app.post('/set-correo', async (req,res) => {
    const Email = req.body.email;
    if(!validateEmail(Email)){
        res.send(`"${Email}" is an invalid email !!! please try again...`);
        return;
    }
    try{
        await fs.promises.writeFile('correo.data', Email);
        res.redirect('/');
    }
    catch(error) {
        console.log(`R/W error setcorreo => ${error}`);
        res.send(error);
    }
});

/*********************************************************
 * Connecting to database & running server
 *********************************************************/
app.set('PORT', process.env.PORT);
mongoose.connect(process.env.MONGO_ATLAS_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw new Error(`Connection error in database: ${err}`);
    console.log('Database connected');
    const server = app.listen(app.get('PORT'), () => {
        console.log('\n-------------------------------------');
        console.log(`Server ready, listening at PORT: ${server.address().port}`);
        console.log('-------------------------------------\n');
        initEmail();
    });
    server.on('error', error => console.log(`Server error => ${error}`));
});