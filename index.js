const express = require('express');
const path = require ('path');
const fs = require ('fs/promises');
const { send } = require('process');

const app = express();
app.use(express.json());
const jsonPath= path.resolve('./files/users.json');

app.get('/users',async (req, res)=>{
    // obtener json
    const jsonFile = await fs.readFile (jsonPath, 'utf8');
    
    // res.send('hola desde express');  
    res.send(jsonFile);

});

//creacion de un usario dentro de un json

app.post ('/users',async (req, res)=>{
// nos envian la informacion 
const user = req.body;
// obtener el arreglo desde json
const usersArray = JSON.parse(await fs.readFile (jsonPath, 'utf8'));
//agregar al usario en el arreglo
//generar un nuevo id 
const lastIndex = usersArray.length - 1;
const newId = usersArray[lastIndex].id + 1;
console.log (newId)
usersArray.push({...user, id: newId});
//escibir la  infomacion en el json
await fs.writeFile(jsonPath, JSON.stringify(usersArray));

res.end ();
})
 //actualizacion de un usuario
// vamos actualizar toda la informacion
//como lo identificamos id, body enviamos el aid de  usuario

app.put('/users', async (req, res) =>{
    const usersArray = JSON.parse(await fs.readFile (jsonPath, 'utf8'));
    const {name, age, contry, id} = req.body;
    // buscar el id del usuario dentro del arreglo
    const userIndex= usersArray.findIndex(user => user.id === id);
    if (userIndex >= 0){
        usersArray [userIndex].name = name;
        usersArray [userIndex].age = age;
        usersArray [userIndex].contry = contry;
    }

    // /escribir nuevamente el arreglo el archivo
    await fs.writeFile (jsonPath, JSON.stringify(usersArray));
    res.send('Usuario actualizado')
    console.log (usersArray)
    res.end()
})

app.delete('/users', async (req, res)=>{
    //otenemos el arreglo desde el json
    const usersArray = JSON.parse(await fs.readFile (jsonPath, 'utf8'));
    //encontrar al usuario que se quiere eliminar
    const{ id }= req.body;
    const userIndex= usersArray.findIndex(user => user.id === id);
   //se elimina el arreglo
   usersArray.splice (userIndex, 1)
   //se escribe en el json
   await fs.writeFile (jsonPath, JSON.stringify(usersArray));
   res.end()
})


const PORT = 8000;
app.listen(PORT, ()=> {
    console.log (`Servidor escuchado en el puerto ${PORT}`)
});


