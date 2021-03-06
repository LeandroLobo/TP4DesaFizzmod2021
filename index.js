import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import fs from 'fs';
import model from './lib/models.js';
import sendEmail from './lib/mailer.js';
import initEmail from './lib/initEmail.js';
import validateEmail from './lib/validateEmail.js';
/****************************************
 * for environment variables management
 * dependencies => "dotenv": "^8.2.0",
 */
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.engine('hbs', handlebars({extname:'.hbs', defaultLayout: 'index.hbs'}));
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/listar', (req,res) => {
    model.product.find({}, (err, products) => {
        if(err) throw new Error(`Reading error: ${err}`);
        console.log('Sending collection to /listar\n');
        res.render('listar', {products});
    }).lean();// using .lean() to get a json object (instead of a mongoose one)
});

app.get('/set-correo', (req,res) => {
    res.sendFile(process.cwd() + '/public/set-correo.html');
});

app.post('/ingreso', (req,res) => {
    const newProduct = new model.product(req.body);
    newProduct.save((err1, newProd) => {
        if(err1) throw new Error(`Writing error: ${err1}`);
        console.log('New product added to database\n');
        //=> Consulting collection length to send email
        model.product.find({}, (err2, products) => {
            if(err2){
                res.send(newProd);
                // throw new Error(`Reading error: ${err2}`);
            }
            if(products.length%10 === 0) sendEmail(products);
            res.redirect('/');
        }).lean();
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

/******************************************
 * Connecting to database & running server
 ******************************************/
app.set('PORT', process.env.PORT);
//mongoose.connect(process.env.MONGO_LOCAL_STRING, {
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