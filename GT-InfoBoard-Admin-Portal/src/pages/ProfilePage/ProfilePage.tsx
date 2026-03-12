import { useState } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { Button } from '../../components/button/Button';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import styles from './ProfilePage.module.scss';

interface User {
  id: string;
  username: string;
}

interface UsersResponse {
  status: string;
  data: User[];
}

export const ProfilePage = () => {
  const { token } = useAuth();

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Create User state
  const [newUsername, setNewUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Users list (refreshes after creating user)
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: usersData, isLoading: usersLoading, error: usersError } =
    useFetch<UsersResponse>(`http://localhost:5001/users?_=${refreshKey}`);

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      const res = await fetch('http://localhost:5001/users/me/password', {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(false);
    try {
      const res = await fetch('http://localhost:5001/users', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ username: newUsername, password: tempPassword }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setCreateSuccess(true);
      setNewUsername('');
      setTempPassword('');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.card}>

          {/* Change Password */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Change Password</h2>
            <form onSubmit={handleChangePassword} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="newPassword">New Password:</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && <p className={styles.error}>{passwordError}</p>}
              {passwordSuccess && <p className={styles.success}>Password updated successfully.</p>}
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Saving...' : 'Update Password'}
              </Button>
            </form>
          </section>

          <hr className={styles.divider} />

          {/* Create User */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Create User</h2>
            <form onSubmit={handleCreateUser} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="newUsername">New Username:</label>
                <input
                  id="newUsername"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="tempPassword">Temp Password:</label>
                <input
                  id="tempPassword"
                  type="password"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  required
                />
              </div>
              {createError && <p className={styles.error}>{createError}</p>}
              {createSuccess && <p className={styles.success}>User created successfully.</p>}
              <Button type="submit" disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create User'}
              </Button>
            </form>
          </section>

          <hr className={styles.divider} />

          {/* All Users */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>All Users</h2>
            {usersLoading && <p className={styles.hint}>Loading users...</p>}
            {usersError && <p className={styles.error}>Failed to load users: {usersError}</p>}
            {!usersLoading && !usersError && (
              <ul className={styles.userList}>
                {(usersData?.data ?? []).map((user) => (
                  <li key={user.id} className={styles.userItem}>
                    {user.username}
                  </li>
                ))}
              </ul>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};
