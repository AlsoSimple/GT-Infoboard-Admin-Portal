import { Navigation } from '../../components/navigation/Navigation';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <Navigation />
      <main className={styles.main}>
        <button className={styles.createButton}>Create new Event</button>
        <div className={styles.eventsList}>
          {/* Event Items */}
        </div>
      </main>
    </div>
  );
};
