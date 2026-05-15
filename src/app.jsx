import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';

function App() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const COLORES = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

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
    container: { padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' },
    titulo: { background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1200px', margin: '0 auto' },
    card: { backgroundColor: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' },
    fullCard: { backgroundColor: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', gridColumn: '1 / span 2' },
    tableWrapper: { maxHeight: '300px', overflowY: 'auto', marginTop: '15px', borderRadius: '8px', backgroundColor: '#0f172a' },
    th: { padding: '12px', position: 'sticky', top: 0, backgroundColor: '#3b82f6', color: 'white' },
    td: { padding: '10px', textAlign: 'center', borderBottom: '1px solid #334155', color: '#cbd5e1' }
  };

  if (cargando) return <div style={{ color: '#3b82f6', textAlign: 'center', marginTop: '20%' }}><h2>Cargando Dashboard...</h2></div>;

  return (
    <div style={estilos.container}>
      <h1 style={estilos.titulo}>Dashboard de Control de Sanciones</h1>

      <div style={estilos.grid}>
        <div style={estilos.fullCard}>
          <h3 style={{ textAlign: 'center', color: '#94a3b8' }}>Top Municipios por Recaudo</h3>
          <div style={estilos.tableWrapper}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={estilos.th}>Municipio</th>
                  <th style={estilos.th}>Recaudo Total</th>
                  <th style={estilos.th}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((d, i) => (
                  <tr key={i}>
                    <td style={estilos.td}>{d.Municipio}</td>
                    <td style={{ ...estilos.td, color: '#10b981', fontWeight: 'bold' }}>$ {Number(d.total_dinero).toLocaleString('es-CO')}</td>
                    <td style={estilos.td}>{d.cantidad_multas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRÁFICO DE TORTA */}
        <div style={estilos.card}>
          <h3 style={{ textAlign: 'center', color: '#94a3b8' }}>Distribución del Recaudo</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={datos.slice(0, 7)}
                  dataKey="total_dinero"
                  nameKey="Municipio"
                  cx="50%" cy="50%"
                  outerRadius={80}
                  label={{ fill: '#cbd5e1', fontSize: 12 }}
                >
                  {datos.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} stroke="#1e293b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={estilos.card}>
          <h3 style={{ textAlign: 'center', color: '#94a3b8' }}>Tendencia de Multas</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={datos.slice(0, 10)}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="Municipio" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Area 
                  type="monotone" 
                  dataKey="cantidad_multas" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorArea)" 
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