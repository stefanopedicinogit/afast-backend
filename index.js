// server.js
const express = require('express');
const cors = require('cors');
const { connect } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const port = 8000;

app.get('/test', async (req, res) => {
    try {
        const connection = await connect();
        const result = await connection.execute('SELECT * FROM afast_results');
        res.json({ result: result[0].map(row => row) });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const { enterprise_id } = req.body;
    try {
        const connection = await connect();
        const result = await connection.execute('SELECT * FROM afast_results WHERE enterprise_id = ?', [enterprise_id]);

        if (result[0].length > 0) {
            res.status(400).json({ error: 'Enterprise ID already existing' });
        } else {
            res.status(200).json({ message: 'Enterprise ID is available' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/save-result', async (req, res) => {
    const {
        enterprise_id,
        score,
        start_time,
        end_time,
        duration_in_sec,
        first_percentage,
        second_percentage,
        third_percentage,
        fourth_percentage,
        fifth_percentage,
    } = req.body;

    try {
        console.log(first_percentage, second_percentage, third_percentage, fourth_percentage, fifth_percentage)
        const connection = await connect();
        const query = `
      INSERT INTO afast_results (
        enterprise_id,
        score,
        start_time,
        end_time,
        duration_in_sec,
        first_percentage,
        second_percentage,
        third_percentage,
        fourth_percentage,
        fifth_percentage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const result = await connection.execute(query, [
            enterprise_id,
            score,
            start_time,
            end_time,
            duration_in_sec,
            first_percentage,
            second_percentage,
            third_percentage,
            fourth_percentage,
            fifth_percentage,
        ]);

        res.json({ message: 'Result saved successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/save-answers', async (req, res) => {
    const {
        enterprise_id,
        domanda,
        risposta,
        categoria_predizione,
        ok_ko
    } = req.body;

    try {
        const connection = await connect();
        const query = `
      INSERT INTO risposte (
        E_ID,
        Domanda,
        Risposta_fornita,
        Categoria_Predizione,
        OK_KO
      ) VALUES (?, ?, ?, ?, ?)
    `;
        const result = await connection.execute(query, [
            enterprise_id,
            domanda,
            risposta,
            categoria_predizione,
            ok_ko
        ]);

        res.json({ message: 'Result saved successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});