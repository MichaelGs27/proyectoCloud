import { BigQuery } from '@google-cloud/bigquery';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
const projectId = process.env.VITE_GOOGLE_PROJECT_ID;
const keyFilename = process.env.VITE_GOOGLE_APPLICATION_CREDENTIALS;

const app = express();
app.use(cors());

const bigquery = new BigQuery({
  keyFilename: keyFilename,
  projectId: projectId,
  location: 'southamerica-east1',
});

app.get('/datos', async (req, res) => {
  const query = `SELECT Municipio, \`Valor Sancion\` FROM \`tarea-496320.tarea.Tabla\``;

  try {
    const [rows] = await bigquery.query(query);
    console.log(`Filas obtenidas: ${rows.length}`);

    const datosLimpios = rows.map(fila => {
      const valorRaw = String(fila['Valor Sancion'] || "0");
      const valorNumerico = parseFloat(
        valorRaw.replace(/\$/g, '').replace(/\./g, '').replace(',', '.')
      ) || 0;

      return {
        Municipio: fila.Municipio || "DESCONOCIDO",
        total_dinero: valorNumerico
      };
    });

    const resumen = Object.values(datosLimpios.reduce((acc, current) => {
      const muni = current.Municipio;
      if (!acc[muni]) {
        acc[muni] = { Municipio: muni, total_dinero: 0, cantidad_multas: 0 };
      }
      acc[muni].total_dinero += current.total_dinero;
      acc[muni].cantidad_multas += 1;
      return acc;
    }, {}));

    const resultadoFinal = resumen
      .sort((a, b) => b.total_dinero - a.total_dinero)
      .slice(0, 50);

    res.json(resultadoFinal);
  } catch (error) {
    console.error("ERROR EN BIGQUERY:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));