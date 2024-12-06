import React from 'react';

const Input = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
      />
    </div>
  );
};

export default Input;
