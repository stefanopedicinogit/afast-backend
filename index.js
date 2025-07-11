// server.js
const express = require('express');
const cors = require('cors');
const { connect } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const port = 8000;

app.get('/get', async (req, res) => {
  try {
    const connection = await connect();
    const result = await connection.all('SELECT * FROM afast_results');

    console.log(result[0]);
    const sum_credito_percentage = result[0].reduce((acc, current) => {
      return acc + parseFloat(current.credito_percentage);
    }, 0);
    const sum_canali_percentage = result[0].reduce((acc, current) => {
      return acc + parseFloat(current.canali_percentage);
    }, 0);
    const sum_finanza_percentage = result[0].reduce((acc, current) => {
      return acc + parseFloat(current.finanza_percentage);
    }, 0);
    const sum_pagamenti_percentage = result[0].reduce((acc, current) => {
      return acc + parseFloat(current.pagamenti_percentage);
    }, 0);
    const sum_risk_percentage = result[0].reduce((acc, current) => {
      return acc + parseFloat(current.risk_percentage);
    }, 0);

    const average_credito_percentage = sum_credito_percentage / result[0].length;
    const average_canali_percentage = sum_canali_percentage / result[0].length;
    const average_finanza_percentage = sum_finanza_percentage / result[0].length;
    const average_pagamenti_percentage = sum_pagamenti_percentage / result[0].length;
    const average_risk_percentage = sum_risk_percentage / result[0].length;

    const averages = {
      avg_credito: average_credito_percentage,
      avg_canali: average_canali_percentage,
      avg_finanza: average_finanza_percentage,
      avg_pagamenti: average_pagamenti_percentage,
      avg_risk: average_risk_percentage
    };

    res.json(averages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
    const { enterprise_id } = req.body;
    try {
        const connection = await connect();
        const result = await connection.all('SELECT * FROM afast_results WHERE enterprise_id = ?', [enterprise_id]);

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
        credito_percentage,
        canali_percentage,
        finanza_percentage,
        pagamenti_percentage,
        risk_percentage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const result = await connection.run(query, [
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
        const result = await connection.run(query, [
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