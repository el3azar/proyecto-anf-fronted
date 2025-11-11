import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { FaArrowRightToBracket } from 'react-icons/fa6';
import { FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Notifier } from '../utils/Notifier';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLoginSubmit = async (data) => {
        setIsSubmitting(true);
        const loadingToastId = Notifier.loading('Iniciando sesión...');

        try {
            // Llamamos a la función de login del contexto (actualmente simulada)
            await login(data.userName, data.password);

            Notifier.dismiss(loadingToastId);
            Notifier.success(`¡Bienvenido, ${data.userName}!`);

            // Siempre navegamos al dashboard principal
            navigate("/dashboard");

        } catch (error) {
            Notifier.dismiss(loadingToastId);
            const errorMessage = "No se pudo conectar con el servidor (simulación).";
            Notifier.showError('No se pudo iniciar sesión', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formWrapper}>
            <section className={styles.formContainer}>
                <h1 className='text-center mb-4'>Análisis Financiero</h1>
                <form onSubmit={handleSubmit(handleLoginSubmit)}>
                    <article>
                        <p>
                            <FaInfoCircle className="me-2" /> Ingresa tus credenciales para acceder.
                        </p>
                    </article>
                    <article className="mb-3">
                        <label htmlFor="userName">Usuario</label>
                        <input
                            type="text"
                            id="userName"
                            {...register('userName', { required: "El usuario es obligatorio" })}
                            className={`w-100 ${errors.userName ? styles.inputError : ''}`}
                        />
                        {errors.userName && <p className={styles.errorMessage}>{errors.userName.message}</p>}
                    </article>
                    <article className="mb-3">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="contrasena"
                            {...register('password', { required: "La contraseña es obligatoria" })}
                            className={`w-100 ${errors.password ? styles.inputError : ''}`}
                        />
                        {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
                    </article>
                    <article className="d-flex justify-content-start">
                        <button type="submit" className={`${styles.customBtn} w-100`} disabled={isSubmitting}>
                            <FaArrowRightToBracket className="me-2" />
                            {isSubmitting ? 'Verificando...' : 'Iniciar sesión'}
                        </button>
                    </article>
                </form>
            </section>
        </div>
    );
}