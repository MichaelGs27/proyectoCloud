import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';
const projectId = import.meta.env.VITE_GOOGLE_PROJECT_ID;

function App() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const COLORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/datos');
        const data = await response.json();
        setDatos(data);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar:", error);
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const estilos = {
      container: { padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' },
      grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' },
      card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
      fullCard: { 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
      gridColumn: '1 / span 2' 
    },
    // NUEVO: Contenedor con Scroll para la tabla
    tableWrapper: {
      maxHeight: '400px', 
      overflowY: 'auto',   
      marginTop: '10px',
      border: '1px solid #eee',
      borderRadius: '8px'
    },
    titulo: { color: '#1a73e8', textAlign: 'center', marginBottom: '30px' },
    th: { 
      padding: '12px', 
      textAlign: 'center', 
      borderBottom: '2px solid #ddd', 
      position: 'sticky', 
      top: 0, 
      backgroundColor: '#1a73e8', 
      color: 'white',
      zIndex: 1
    },
    td: { padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }
  };

  if (cargando) return <div style={estilos.container}><h2>Procesando datos de BigQuery...</h2></div>;

  return (
    <div style={estilos.container}>
      <h1 style={estilos.titulo}>📊 Dashboard de Control de Sanciones</h1>

      <div style={estilos.grid}>
        
        {/* TABLA PRINCIPAL CON SCROLL */}
        <div style={estilos.fullCard}>
          <h3 style={{ textAlign: 'center' }}>Top Municipios por Recaudo</h3>
          
          <div style={estilos.tableWrapper}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={estilos.th}>Municipio</th>
                  <th style={estilos.th}>Recaudo Total</th>
                  <th style={estilos.th}>Cantidad de Multas</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((d, i) => (
                  <tr key={i}>
                    <td style={estilos.td}>{d.Municipio}</td>
                    <td style={{ ...estilos.td, fontWeight: 'bold', color: '#2e7d32' }}>
                      $ {Number(d.total_dinero).toLocaleString('es-CO')}
                    </td>
                    <td style={estilos.td}>{d.cantidad_multas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: 'right', fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
            * Desliza hacia abajo para ver más registros
          </p>
        </div>
        <div style={estilos.card}>
          <h3 style={{ textAlign: 'center' }}> Distribución del Recaudo (7 primeros)</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={datos.slice(0, 7)}
                  dataKey="total_dinero"
                  nameKey="Municipio"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ Municipio, percent }) => `${Municipio} ${(percent * 100).toFixed(0)}%`}
                >
                  {datos.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$ ${Number(value).toLocaleString('es-CO')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={estilos.card}>
          <h3 style={{ textAlign: 'center' }}> Frecuencia de Sanciones (10 primeros)</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={datos.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Municipio" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="cantidad_multas" 
                  name="N° Multas" 
                  stroke="#1a73e8" 
                  fill="#d1e3fa" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;