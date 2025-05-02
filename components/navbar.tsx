import { Bell, Settings } from 'lucide-react';
import styles from '@styles/navbar.module.css';

const NavBar: React.FC = () => {
  return (
    <div className={styles['nav-bar']}>
      <div className={styles['nav-bar-content']}>
        <img
          src="https://cdn.shopify.com/s/files/1/0059/8835/2052/files/Brightwell_Blueberry_1_9dc5ee7d-21ea-4dc8-9edb-03bb36f0c4c8.jpg?v=1707166838"
          alt="Logo"
          className={styles['logo']}
        />
        <section className={styles['icon-group']}>
          <Bell className={styles.icon} />
          <Settings className={styles.icon} />
        </section>
      </div>
      <h2 className={styles['greeting']}>HELLO, USER!!</h2>
    </div>
  );
};

export default NavBar;