# 🚀 Sistema de Análisis Financiero - Frontend

Este es el repositorio del frontend para el proyecto de **Análisis Financiero**. Esta aplicación, desarrollada con React, consume la API REST proporcionada por nuestro backend en Spring Boot para ofrecer una interfaz de usuario interactiva y moderna.

---

## 📋 Tabla de Contenidos

1.  [Tecnologías Utilizadas](#-tecnologías-utilizadas)
2.  [Prerrequisitos](#-prerrequisitos)
3.  [Guía de Inicio Rápido](#-guía-de-inicio-rápido)
4.  [Scripts Disponibles](#-scripts-disponibles)
5.  [Variables de Entorno](#-variables-de-entorno)
6.  [Estructura de Carpetas](#-estructura-de-carpetas)

---

## 🛠️ Tecnologías Utilizadas

*   **Vite** (Bundler y servidor de desarrollo ultrarrápido)
*   **React 18** (incluyendo Hooks)
*   **React Router DOM** (para la gestión de rutas)
*   **Axios** (para las peticiones a la API)
*   **Material-UI (MUI)** (biblioteca de componentes de UI)
*   **Formik & Yup** (para la gestión y validación de formularios)
*   **Recharts** (para la creación de gráficos)
*   **Context API** (para la gestión de estado global, como la autenticación)

---

## ✅ Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema antes de continuar:

*   **Node.js** (versión LTS, ej. 20.x o superior). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
*   **npm** (usualmente viene incluido con Node.js).
*   **Git**.

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para tener el proyecto corriendo en tu máquina local:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/el3azar/proyecto-anf-fronted.git
    cd proyecto-anf-fronted
    ```

2.  **Instalar las dependencias:**
    Este comando leerá el archivo `package.json` y descargará todas las librerías necesarias.
    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno:**
    Crea un archivo llamado `.env` en la raíz del proyecto. Puedes hacerlo copiando el archivo de ejemplo:
    ```bash
    cp .env.example .env
    ```
    Si no tienes un `.env.example`, simplemente crea el archivo `.env` y añade el siguiente contenido. Asegúrate de que la URL apunte a tu backend local.
    ```
    VITE_API_BASE_URL=http://localhost:8080/api
    ```
    > **Importante:** El archivo `.env` es local y nunca debe ser subido a GitHub. Ya está incluido en el `.gitignore`.

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    ¡Listo! La aplicación ahora estará corriendo en `http://localhost:5173` (o el puerto que la terminal indique).

---

## 📜 Scripts Disponibles

En este proyecto, puedes ejecutar los siguientes scripts:

*   `npm run dev`: Inicia la aplicación en modo de desarrollo con hot-reloading.
*   `npm run build`: Compila la aplicación para producción en la carpeta `dist/`.
*   `npm run preview`: Sirve la carpeta de producción (`dist/`) para previsualizar cómo se verá la aplicación final.

---

## ⚙️ Variables de Entorno

Todas las variables de entorno deben comenzar con el prefijo `VITE_`.

*   `VITE_API_BASE_URL`: La URL base de la API del backend a la que nos conectaremos.

---

## 📂 Estructura de Carpetas

La estructura del proyecto está diseñada para ser escalable y organizada por funcionalidad:

*   **`/assets`**: Contiene archivos estáticos como imágenes, SVGs y fuentes.
*   **`/components`**: Componentes de UI **reutilizables y "tontos"** (no manejan lógica de negocio).
    *   `/common`: Componentes genéricos como `Button`, `Input`, `Modal`.
    *   `/layout`: Estructura principal de la app (`Sidebar`, `Navbar`, `MainLayout`).
*   **`/context`**: Para el estado global. Aquí vive `AuthContext`, que maneja la sesión del usuario.
*   **`/hooks`**: Hooks de React personalizados para encapsular lógica compleja y reutilizable (ej. `useApi` para llamadas a la API, `useAuth`).
*   **`/routes`**: Define la configuración de enrutamiento de la aplicación (`AppRouter`) y la lógica para rutas protegidas.
*   **`/schemas`**: Contiene los esquemas de validación de `Yup` para los formularios de la aplicación.
*   **`/services`**: Centraliza toda la comunicación con la API del backend. Cada archivo corresponde a un módulo del backend.
*   **`/utils`**: Funciones de ayuda puras y genéricas (ej. formatear fechas, validar números).
