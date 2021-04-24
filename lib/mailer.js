import { createTransport } from 'nodemailer';
import fs from 'fs';

const sendEmail = async data => {

    if(!Array.isArray(data)){
        console.error('Array type argument is required', Array.isArray(data), typeof destiny);
        return;
    }

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'leandrolobomailer@gmail.com',
            pass: '0600mailer'
        }
    });

    try{
        const email = await fs.promises.readFile('correo.data','utf-8');
        const mailOptions = {
            from: 'Leandro Lobo Mailer',
            to: email,
            subject: 'Listado de productos actualizado',
            html: `
            <div style="background-color:grey;padding:10px;">
                <h2 style="text-align:center;">Listado de Productos:</h2>
                <ul>${(data.length == 0)
                    ?'<h2 style="text-align:center;">Empty DB</h2>'
                    :data.map(product => (`
                    <li style="margin: 0;">
                        <p style="margin: 0;">
                            Nombre: <strong>${product.name}</strong>,
                            Precio: <strong>$${product.price}</strong>,
                            Descripción: <strong>${product.desc}</strong>
                        </p>
                    </li>`))}
                </ul>
            </div>`
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log(err);
                return err;
            }
            console.log('\n ENVIADO \n');
            console.log(info);
        });
    }
    catch(error) {
        console.log(`R/W error => ${error}`);
    };
}

export default sendEmail;