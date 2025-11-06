import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../styles/shared/SubMenu.module.css'; 

/**
 * Componente de Sub-navegación reutilizable.
 * @param {Array<Object>} links - Un array de objetos de enlace.
 * @param {string} links[].to - La ruta del enlace (ej. '/empresas/listado').
 * @param {string} links[].label - El texto a mostrar en el botón.
 */
const SubMenu = ({ links = [] }) => {
  return (
    <nav className={styles.subnav}>
      <div className={styles.subnavContainer}>
        {links.map(link => (
          // Usamos NavLink para que detecte la ruta activa automáticamente
          <NavLink
            key={link.to}
            to={link.to}
            // La clase 'active' se aplicará automáticamente por NavLink
            className={({ isActive }) =>
              isActive ? `${styles.subnavBtn} ${styles.active}` : styles.subnavBtn
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default SubMenu;