const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Conectar ao MongoDB
const uri = 'mongodb+srv://frkp:<UUy6G!6S2tyLEc6>@college-list.7ensf.mongodb.net/?retryWrites=true&w=majority&appName=college-list';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
    const db = client.db('nome-do-seu-banco');
    const studentsCollection = db.collection('students');

    // Rota para adicionar um aluno
    app.post('/add-student', async (req, res) => {
        const { name, college } = req.body;
        if (!name || !college) {
            return res.status(400).send('Nome e faculdade são obrigatórios');
        }

        const result = await studentsCollection.insertOne({ name, college });
        res.status(201).send(`Aluno adicionado com o ID: ${result.insertedId}`);
    });

    // Rota para obter todos os alunos
    app.get('/students', async (req, res) => {
        const students = await studentsCollection.find().toArray();
        res.status(200).json(students);
    });

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}).catch(err => console.error(err));
