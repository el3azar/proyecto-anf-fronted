import { Link } from "react-router-dom";
import styles from '../../styles/DashboardCards.module.css';

// 1. Modificamos la firma del componente para aceptar la descripción
const DashboardCards = ({ title, items }) => (
  <section className={styles.cardsSection}>
    <header>
      <h2 className={styles.title}>{title}</h2>
    </header>
    <div className="row justify-content-center">
      
      {/* 2. Aquí extraemos la 'descripcion' del item en el map */}
      {items.map(({ label, icon: Icon, to, descripcion }, i) => (
        <article key={i} className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
          <Link to={to} className={styles.dashboardCard}>
            
            <div className={styles.cardIconWrapper}>
              {Icon && <Icon size={48} className={styles.cardIcon} />}
            </div>
            
            <div className={styles.cardLabel}>{label}</div>
            
            {
              
            }
            {descripcion && (
              <p className={styles.cardDescription}>
                {descripcion}
              </p>
            )}

          </Link>
        </article>
      ))}
    </div>
  </section>
);

export default DashboardCards;