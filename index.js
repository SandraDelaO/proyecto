//Importamos las librarías requeridas
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('capybara.db');

//Documentación en https://expressjs.com/en/starter/hello-world.html
const app = express()

//Creamos un parser de tipo application/json
//Documentación en https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json()


app.get('/', function (req, res) {
    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'status': 'ok' }));
})

//Creamos un endpoint de login que recibe los datos como json
app.post('/login', jsonParser, function (req, res) {
    //Imprimimos el contenido del body
    console.log(req.body);

    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ 'status': 'ok' }));
})

app.get('/mostrar_todo', jsonParser, function (req, res){
    db.serialize(() => {
        db.each("SELECT * from todos", (err, row) => {         
            if(row){
                return res.status("201").json({"result":row})
            }else{
                return res.status("404").json({"result":"error"})
            }   
            
        });
    });
})


app.post('/agregar_todo', jsonParser, function (req, res){
    console.log(req.body)
    db.serialize(() => {
        db.run("insert into todos (todos,created_at)values(?,?)",[req.body.todos,req.body.created_at],(err)=>{
            if (err) {
                return res.status("401").end(err.message);
              }              
              //res.end('Datos guardados correctamente');
        })

        db.each("SELECT * from todos where todos like '"+req.body.todos+"' limit 1", (err, row) => {
            console.log(row);
            return res.status("201").end(JSON.stringify({'result':row}))
        });
    });
/*    console.log(req.body);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ 'status': 'ok' }));*/
})

//Corremos el servidor en el puerto 3000
const port = 3001;

app.listen(port, () => {
    console.log(`Aplicación corriendo en http://localhost:${port}`)
})