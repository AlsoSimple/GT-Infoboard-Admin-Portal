import { useState, useEffect } from 'react';
import { useFetchV2 } from '../../hooks/useFetchV2';
import { useParams } from 'react-router-dom';
import style from './EditEventPage.module.scss';

  

export function EditEventPage() {
  // Get event id from route params
  const { id: eventId } = useParams();
  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const maxChars = 600;

  // Fetch the event data with Authorization header
  const token = localStorage.getItem('token');
  const { data: event, isLoading, error } = useFetchV2(
    `http://localhost:5001/events/${eventId}`,
    token ? { Authorization: `Bearer ${token}` } : {}
  );
  // Populate form fields when event is loaded
  useEffect(() => {
    if (event && event.data) {
      console.log('Fetched event:', event.data);
      setText(event.data.text || '');
      // Convert ISO string to YYYY-MM-DD for input type="date"
      if (event.data.startDate) setStartDate(event.data.startDate.slice(0, 10));
      if (event.data.endDate) setEndDate(event.data.endDate.slice(0, 10));
    }
  }, [event]);

  // Helper to format YYYY-MM-DD to DD-MM-YYYY
  const formatDanishDate = (val: string) => {
    if (!val) return '';
    const [y, m, d] = val.split('-');
    if (!y || !m || !d) return val;
    return `${d}-${m}-${y}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Convert date to ISO string with default time for API
    const toISOStringWithZ = (val: string, defaultTime?: string) => {
      if (!val) return '';
      let value = val;
      // If only date is provided, append default time
      if (/^\d{4}-\d{2}-\d{2}$/.test(val) && defaultTime) {
        value = `${val}T${defaultTime}`;
      }
      // Parse as UTC, not local time
      const [datePart, timePart] = value.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      let hours = 0, minutes = 0;
      if (timePart) {
        [hours, minutes] = timePart.split(':').map(Number);
      }
      // Construct a UTC date
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      return date.toISOString();
    };
    const updatedEvent = {
      text,
      startDate: toISOStringWithZ(startDate, '00:00'),
      endDate: toISOStringWithZ(endDate, '23:59'),
    };
    try {
      const res = await fetch(`http://localhost:5001/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedEvent),
      });
      if (!res.ok) throw new Error(`Error status: ${res.status}`);
      alert('Event updated!');
    } catch (err) {
      alert('Failed to update event: ' + (err instanceof Error ? err.message : err));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5001/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Error status: ${res.status}`);
      alert('Event deleted!');
      // Optionally redirect or clear form here
    } catch (err) {
      alert('Failed to delete event: ' + (err instanceof Error ? err.message : err));
    }
  };

  if (isLoading) return <div>Loading event...</div>;
  if (error) return <div>Error loading event: {error}</div>;

  return (
    <div className={style.editEventPage}>
      <h1>Edit Event</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div>Event</div>
          <textarea
            maxLength={maxChars}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Text"
            style={{ width: 350, height: 140 }} // temp
          />
          <div>
            {text.length} / {maxChars} characters
          </div>
        </div>
        <div>
          <div>Start Date</div>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
          {startDate && (
            <div style={{ fontSize: 12, color: '#555' }}>
              Dansk format: {formatDanishDate(startDate)}
            </div>
          )}
        </div>
        <div>
          <div>End Date</div>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
          {endDate && (
            <div style={{ fontSize: 12, color: '#555' }}>
              Dansk format: {formatDanishDate(endDate)}
            </div>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <button type="button" onClick={handleDelete} style={{ marginRight: 8 }}>Delete</button>
          <button type="submit">Accept</button>
        </div>
      </form>
    </div>
  );
}