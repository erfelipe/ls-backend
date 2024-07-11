const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

var conString = config.urlConnection;

// var client = new Client(conString);
const client = new Client({
  user: 'postgres',
  password: '',
  host: 'localhost',
  port: 8892,
  database: 'postgres',
})

client.connect((err) => {
  if (err) {
    return console.error('Não foi possível conectar ao banco.', err);
  }
  client.query('SELECT NOW()', (err, result) => {
    if (err) {
      return console.error('Erro ao executar a query.', err);
    }
    console.log(result.rows[0]);
  });
});

app.get("/", (req, res) => {
  console.log("Ok – Servidor disponível.");
  res.status(200).send("Ok – Servidor disponível.");
});

app.get("/editais", (req, res) => {
  try {
    client.query("SELECT * FROM editais where data > now() order by estado, data ", function (err, result) {
      if (err) {
        res.status(404).send("Erro: " + err);
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.status(200).send(result.rows);
      result.rows.forEach( (item) => console.log(item));
    });
  } catch (error) {
    res.status(404).send("Erro: " + error);
    console.log(error);
  }
});


app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);
