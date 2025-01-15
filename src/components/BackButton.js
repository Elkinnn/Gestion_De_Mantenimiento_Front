import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ onClick, style }) => {
    return (
        <button
            onClick={onClick || (() => window.history.back())}
            style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                position: 'absolute',
                right: '20px',
                top: '20px', 
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10, 
                transform: 'translateY(65px)',
                ...style,
            }}
        >
            <FaArrowLeft />
        </button>
    );
};

export default BackButton;
