import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import '../styles/custom-swal.css'; // Asegúrate de crear este archivo

const swalCustomClasses = {
  popup: 'swal-popup-custom',
  title: 'swal-title-custom',
  htmlContainer: 'swal-html-container-custom',
  icon: 'swal-icon-custom',
  confirmButton: 'swal-button-confirm-custom',
  cancelButton: 'swal-button-cancel-custom',
};

export const Notifier = {
  success: (message = '¡Operación exitosa!') => toast.success(message),
  error: (message = 'Ocurrió un error.') => toast.error(message),
  info: (message, options = {}) => toast(message, { icon: 'ℹ️', ...options }),
  warning: (message) => toast(message, { icon: '⚠️' }),
  loading: (message = 'Cargando...') => toast.loading(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  showError: (title, text) => {
    return Swal.fire({ title, text, icon: 'error', confirmButtonText: 'Entendido', customClass: swalCustomClasses });
  },
  confirm: ({ title, text, confirmButtonText = 'Sí, continuar' }) => {
    return Swal.fire({ title, text, icon: 'warning', showCancelButton: true, confirmButtonText, cancelButtonText: 'Cancelar', customClass: swalCustomClasses });
  },
};