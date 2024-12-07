import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const goToLotes = () => {
    navigate('/lotes');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Bienvenido al Dashboard</h2>
      <p>Este es el área protegida de la aplicación, donde puedes ver información exclusiva.</p>
      <button
        onClick={goToLotes}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Ir a Cargar Lotes
      </button>
    </div>
  );
};

export default Dashboard;
