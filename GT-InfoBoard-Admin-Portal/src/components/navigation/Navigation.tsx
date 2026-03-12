import styles from './Navigation.module.scss';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface UserData {
  status: string;
  data: {
    username: string;
    id: string;
    mustChangePassword: boolean;
    createdAt: string;
  };
}

export const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://gt-infoboardapi-production.up.railway.app/users/me', { headers });

        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  console.log('User data:', user, 'Loading:', isLoading, 'Error:', error);

  return (
    <nav className={styles.navigation}>
      <h1 className={styles.title} style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
        Home
      </h1>
      <div className={styles.userSection}>
        <h2>
          {isLoading ? 'Loading...' : error ? 'User' : user?.data?.username || 'User'}
        </h2>
        <button className={styles.userIcon} onClick={() => navigate('/profile')}><FaUser size={20} /></button>
      </div>
    </nav>
  );
};
