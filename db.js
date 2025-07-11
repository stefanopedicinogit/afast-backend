// db.js
import { createClient } from "@libsql/client";

const turso = createClient({
  url: 'libsql://afastdb-stefanopedicinogit.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjAwMTg2MTAsImdpZCI6IjNiYTQ0NzM1LWVmOTctNDVlNy1hYzAxLTgyOGI5NTlmOTIxOSIsImlhdCI6MTc1MjI0MjYxMCwicmlkIjoiNTQzNjRmZDQtZmM5Zi00NDg4LTgzYzQtZDdiOTg2NDc1M2M4In0.j_5TEdI7sEMPL_DWnyRANitTmeK6LvysWXQSpw3ezYyBwfSc7cbPglnPbOuUWH_vfrQbi1wOrHZpujuhLy06BA'
});

export async function retrieve_get() {
  console.log(turso);
  try {
    const query = 'SELECT * FROM afast_results';
    const response = await turso.execute(query);
    return response;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export async function login(enterprise_id) {
  try {
    const query = 'SELECT * FROM afast_results WHERE enterprise_id = ?'
    const response = await turso.execute(query, [enterprise_id]);
    return response;
  }
  catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}


export async function insert_result(enterprise_id, score, start_time, end_time, duration_in_sec, credito_percentage, canali_percentage, finanza_percentage, pagamenti_percentage, risk_percentage) {
  try {
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

    const response = await turso.execute(query, [enterprise_id, score, start_time, end_time, duration_in_sec, credito_percentage, canali_percentage, finanza_percentage, pagamenti_percentage, risk_percentage]);
    return response;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export async function insert_answer(enterprise_id, domanda,risposta, categoria_predizione, ok_ko) {
  try {
    const query = `
      INSERT INTO risposte (
        E_ID,
        Domanda,
        Risposta_fornita,
        Categoria_Predizione,
        OK_KO
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const response = await turso.execute(query, [enterprise_id, domanda, risposta, categoria_predizione, ok_ko]);
    return response;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}
