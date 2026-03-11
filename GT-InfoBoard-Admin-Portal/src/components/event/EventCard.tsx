import styles from './EventCard.module.scss';

interface EventCardProps {
  date: string;
  text: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EventCard = ({ date, text, onEdit, onDelete }: EventCardProps) => {
  return (
    <div className={styles.card}>
      <span className={styles.date}>{date}</span>
      <span className={styles.text}>{text}</span>
      <div className={styles.actions}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};
