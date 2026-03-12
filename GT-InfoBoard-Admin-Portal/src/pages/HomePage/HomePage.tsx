import { Navigation } from '../../components/navigation/Navigation';
import { Button } from '../../components/button/Button';
import { EventCard } from '../../components/event/EventCard';
import { useFetch } from '../../hooks/useFetch';
import styles from './HomePage.module.scss';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: string;
  text: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  creator: { id: string; username: string };
}

interface EventsResponse {
  status: string;
  data: Event[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'long' });

const getMonthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('da-DK', { month: 'long', year: 'numeric' });

export const HomePage = () => {
  const { data, isLoading, error } = useFetch<EventsResponse>('https://gt-infoboardapi-production.up.railway.app/events');
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = data?.data.filter(
    (event) => new Date(event.startDate) >= today
  ) ?? [];

  // Group events by month label, e.g. { "april 2026": [...], "maj 2026": [...] }
  const eventsByMonth: Record<string, Event[]> = {};
  for (const event of upcomingEvents) {
    const month = getMonthLabel(event.startDate);
    if (!eventsByMonth[month]) eventsByMonth[month] = [];
    eventsByMonth[month].push(event);
  }

  return (
    <div className={styles.container}>
      <Navigation />
      <main className={styles.main}>
        <Button onClick={() => navigate('/create-event')}>Create new Event</Button>
        <div className={styles.eventsContainer}>
          {isLoading && <p>Loading events...</p>}
          {error && <p>Failed to load events: {error}</p>}
          {!isLoading && !error && upcomingEvents.length === 0 && (
            <p>No upcoming events.</p>
          )}
          {Object.entries(eventsByMonth).map(([month, events]) => (
            <div key={month}>
              <h3 className={styles.monthLabel}>{month}</h3>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  date={formatDate(event.startDate)}
                  text={event.text.length > 35 ? event.text.slice(0, 35) + '...' : event.text}
                  onEdit={() => navigate(`/edit-event/${event.id}`)}
                  onDelete={() => console.log('Delete', event.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
