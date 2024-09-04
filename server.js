const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// Middleware para interpretar JSON
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
const uri = 'mongodb+srv://frkp:UUy6G!6S2tyLEc6@college-list.7ensf.mongodb.net/?retryWrites=true&w=majority&appName=college-list';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
    const db = client.db('nome-do-seu-banco');
    const studentsCollection = db.collection('students');

    // Rota para adicionar um aluno
    app.post('/add-student', async (req, res) => {
        console.log(req.body); // Adicione este log

        const { studentName, collegeName } = req.body;
        if (!studentName || !collegeName) {
            return res.status(400).send('Nome e faculdade são obrigatórios');
        }

        const result = await studentsCollection.insertOne({ studentName, collegeName });
        res.status(201).json({ id: result.insertedId.toString() }); // Retorna o ID como string
    });

    // Rota para obter todos os alunos
    app.get('/students', async (req, res) => {
        const students = await studentsCollection.find().toArray();

        // Agrupa os alunos por faculdade
        const faculdades = students.reduce((acc, { studentName, collegeName }) => {
            if (!acc[collegeName]) {
                acc[collegeName] = [];
            }
            acc[collegeName].push(studentName);
            return acc;
        }, {});

        res.status(200).json(faculdades);
    });

    // Rota para remover um aluno específico usando studentName e collegeName
    app.delete('/remove-student', async (req, res) => {
        const { studentName, collegeName } = req.body;
        if (!studentName || !collegeName) {
            return res.status(400).send('Nome e faculdade são obrigatórios');
        }

        try {
            // Remove o aluno baseado em studentName e collegeName
            const result = await studentsCollection.deleteOne({ studentName, collegeName });
            if (result.deletedCount > 0) {
                res.status(200).send('Aluno removido com sucesso.');
            } else {
                res.status(404).send('Aluno não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao remover aluno:', error);
            res.status(500).send('Erro ao remover aluno.');
        }
    });

    // Rota para deletar todos os alunos
    app.delete('/students/all', async (req, res) => {
        try {
            await studentsCollection.deleteMany({});
            res.status(200).send('Todos os alunos foram apagados com sucesso.');
        } catch (error) {
            console.error('Erro ao apagar todos os alunos:', error);
            res.status(500).send('Erro ao apagar todos os alunos.');
        }
    });

// Rota para resetar a lista de alunos
app.delete('/reset-students', async (req, res) => {
    try {
      await studentsCollection.deleteMany({});
      res.status(200).send('Todos os alunos foram apagados com sucesso.');
    } catch (error) {
      console.error('Erro ao apagar todos os alunos:', error);
      res.status(500).send('Erro ao apagar todos os alunos.');
    }
  });
  
  

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}).catch(err => console.error(err));
