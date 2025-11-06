import { Link } from "react-router-dom";
import styles from '../../styles/DashboardCards.module.css';

const DashboardCards = ({ title, items }) => (
  <section className={styles.cardsSection}>
    <header>
      <h2 className={styles.title}>{title}</h2>
    </header>
    <div className="row justify-content-center">
      {items.map(({ label, icon: Icon, to }, i) => (
        <article key={i} className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
          <Link to={to} className={styles.dashboardCard}>
            {/* El ícono ahora tiene su propia clase para controlarlo en el hover */}
            <div className={styles.cardIconWrapper}>
              {Icon && <Icon size={48} className={styles.cardIcon} />}
            </div>
            {/* El texto también tiene su propia clase */}
            <div className={styles.cardLabel}>{label}</div>
          </Link>
        </article>
      ))}
    </div>
  </section>
);

export default DashboardCards;