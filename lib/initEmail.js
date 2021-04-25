import fs from 'fs';

const initEmail = async () => {
    try{
        await fs.promises.readFile('correo.data','utf-8');
    }
    catch(error){
        if(error.code === 'ENOENT'){
            try{
                await fs.promises.writeFile('correo.data','leandrolobomarquez@gmail.com');
                console.log('correo.data initialized: "leandrolobomarquez@gmail.com"\n');
            }
            catch(error){
                console.log(error);
            }
        }
        else console.log(error);
    }
}

export default initEmail;