import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  return <ToastContainer />;
};

// Funciones para mostrar notificaciones
export const showSuccessNotification = (message) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 3000, // Tiempo de cierre automático
  });
};

export const showErrorNotification = (message) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 3000, // Tiempo de cierre automático
  });
};

export const showInfoNotification = (message) => {
  toast.info(message, {
    position: 'top-center',
    autoClose: 3000, // Tiempo de cierre automático
  });
};

export default Notification;
