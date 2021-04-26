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

    let LISTA = '';
    data.forEach(product => {
        LISTA += `
        <tr>
            <td>${product.name}</td>
            <td><b>$${product.price}</b></td>
            <td>${product.desc}</td>
            <td>
                <img src=${product.url} alt=${product.name}/>
            </td>
        </tr>`
    });

    try{
        const email = await fs.promises.readFile('correo.data','utf-8');
        const mailOptions = {
            from: 'Leandro Lobo Mailer',
            to: email,
            subject: 'Listado de productos actualizado',
            html: `
            <head><style>
                td{text-align:center; margin: 0 3px;}
                img{height: 70px;}
            </style></head>
            <div>
                <h2>Listado de Productos:</h2>
                <table>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Foto</th>
                    </tr>
                    ${LISTA}
                </table>
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