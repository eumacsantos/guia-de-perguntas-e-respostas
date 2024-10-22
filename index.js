const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8000;
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!");
    })
    .catch((erro) => {
        console.log(erro);
    })

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extend: false}))
app.use(bodyParser.json());

app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order:[['id','DESC']] }).then(perguntas => {
        res.render("index",{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var reqTitulo = req.body.titulo;
    var reqDescricao = req.body.descricao;
    Pergunta.create({
        titulo: reqTitulo,
        descricao: reqDescricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: {idPergunta: pergunta.id},
                order: [
                    ['id','DESC']
                ]
            }).then(resposta => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    resposta: resposta
                });
            });     
        } else {
            res.redirect("/");
        }
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        idPergunta: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
});

app.listen(port, () => {console.log("App rodando!");});