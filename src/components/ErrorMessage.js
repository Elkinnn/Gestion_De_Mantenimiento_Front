// src/components/Button.js
import React from 'react';

const Button = ({ text, onClick, style, disabled }) => {
  return (
    <button onClick={onClick} style={{ ...styles.button, ...style }} disabled={disabled}>
      {text}
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '5px',
  },
};

export default Button;
