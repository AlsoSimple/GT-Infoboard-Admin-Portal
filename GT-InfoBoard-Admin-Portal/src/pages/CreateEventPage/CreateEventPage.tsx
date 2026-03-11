import { useState } from 'react';
import { usePost } from '../../hooks/usePost';
import style from './CreateEventPage.module.scss'

export const CreateEventPage = () => {
  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const maxChars = 600;
  const { data, isLoading, error, post } = usePost('http://localhost:5001/events');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Convert datetime-local (YYYY-MM-DDTHH:mm) to ISO string with Z (UTC)
    const toISOStringWithZ = (val: string, defaultTime?: string) => {
      if (!val) return '';
      let value = val;
      // If only date is provided (YYYY-MM-DD), append default time
      if (/^\d{4}-\d{2}-\d{2}$/.test(val) && defaultTime) {
        value = `${val}T${defaultTime}`;
      }
      const date = new Date(value);
      return date.toISOString();
    };
    const token = localStorage.getItem('token');
    post(
      {
        text,
        startDate: toISOStringWithZ(startDate, '00:00'), // default to 00:00 if only date
        endDate: toISOStringWithZ(endDate, '23:59'), // default to 23:59 if only date
      },
      token ? { Authorization: `Bearer ${token}` } : {}
    );
  };

  // API'et forventer ikke dansk format, så inputtet viser ikke dansk format
  // Helper to format YYYY-MM-DD to DD-MM-YYYY
  const formatDanishDate = (val: string) => {
    if (!val) return '';
    const [y, m, d] = val.split('-');
    if (!y || !m || !d) return val;
    return `${d}-${m}-${y}`;
  };

  return (
    <div className={style.createEventPage}>
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div>Event</div>
          <textarea
            maxLength={maxChars}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Text"
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
        <button type="submit" disabled={isLoading}>Submit</button>
      </form>
      {error && <div>{error}</div>}
      {data && <div>Event created!</div>}
    </div>
  );
};
