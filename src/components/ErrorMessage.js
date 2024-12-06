import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p style={{ color: 'red', marginTop: '10px' }}>
      {message}
    </p>
  );
};

export default ErrorMessage;
