// server.js
const express = require('express');
const cors = require('cors');
const { retrieve_get, login, insert_result, insert_answer } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const port = 8000;

app.get('/get', async (req, res) => {
  try {
    const response = await retrieve_get();
    const result = response.rows
    console.log('res', result);
    if (result.length !== null || result.length !== undefined || result.length !== 0) {

      const sum_credito_percentage = result.reduce((acc, current) => acc + current.credito_percentage, 0);
      const sum_canali_percentage = result.reduce((acc, current) => acc + current.canali_percentage, 0);
      const sum_finanza_percentage = result.reduce((acc, current) => acc + current.finanza_percentage, 0);
      const sum_pagamenti_percentage = result.reduce((acc, current) => acc + current.pagamenti_percentage, 0);
      const sum_risk_percentage = result.reduce((acc, current) => acc + current.risk_percentage, 0);
      
      const average_credito_percentage = sum_credito_percentage / result.length;
      const average_canali_percentage = sum_canali_percentage / result.length;
      const average_finanza_percentage = sum_finanza_percentage / result.length;
      const average_pagamenti_percentage = sum_pagamenti_percentage / result.length;
      const average_risk_percentage = sum_risk_percentage / result.length;

      const averages = {
        avg_credito: average_credito_percentage,
        avg_canali: average_canali_percentage,
        avg_finanza: average_finanza_percentage,
        avg_pagamenti: average_pagamenti_percentage,
        avg_risk: average_risk_percentage
      };

      res.status(200).json(averages);
    }
    else {
      res.status(501).json({ error: 'No data found' });
      return;
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { enterprise_id } = req.body;
  try {
    const response = await login(enterprise_id);
    const result = response.rows
    console.log('result', result);

    if (result.length > 0) {
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
    const response = await insert_result(enterprise_id, score, start_time, end_time, duration_in_sec, first_percentage, second_percentage, third_percentage, fourth_percentage, fifth_percentage);
    const result = response.rows
    res.status(200).json({ message: 'Result saved successfully' });
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
    const response = await insert_answer(enterprise_id, domanda, risposta, categoria_predizione, ok_ko);
    const result = response.rows
    res.json({ message: 'Result saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});