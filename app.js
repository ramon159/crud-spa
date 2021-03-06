const express = require('express');
const handlebars = require('express-handlebars');
const mysql = require('mysql2')

const app = express();
const port = 3000;
const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'crud',
});


app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/js/javascript.js');
});
app.get('/style', (req, res) => {
    res.sendFile(__dirname + '/css/style.css');
});

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/create', (req, res) => {
    const r = req.body
    console.log("insert: ",r)
    const {name, age} = r;
    sql.query('insert into user (name, age) values (?,?)', [name, age]);
    sql.query('SELECT * FROM user ORDER BY id DESC LIMIT 1', (err, results) => {
        const id = results[0].id
        res.json({id: id, name: name, age: age})
    })
})

app.get('/read', (req, res) => {
    sql.query('select * from user', (err, results) => {
        console.log(results)
        res.json({data: results})
    })
})

app.post('/update', (req, res) => {
    const r = req.body;
    const {id,name,age} = r;
    sql.query('update user set name = ?, age = ? where id = ?', [name,age, id]);
    console.log("update: ",r)
    res.json({id: id, name: name, age: age})
})

app.post('/delete', (req, res) => {
    const r = req.body 
    console.log("delete: ",r)
    sql.query('delete from user where id = ?', [r.id])
    res.json({id: r.id})
})

app.listen(port, () => {
    console.log('Listening on port', port);
})