import React, { useEffect, useState } from 'react';

interface Administrator {
  username: string;
  name: string;
  password: string;
}

const AdminPage: React.FC = () => {
  const [admins, setAdmins] = useState<Administrator[]>([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/auth/admins');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      } else {
        setMessage('Failed to load administrators');
      }
    } catch {
      setMessage('Error loading administrators');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = async () => {
    setMessage('');
    if (!name || !username || !password) {
      setMessage('Please fill all fields');
      return;
    }
    try {
      const res = await fetch('/api/auth/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      });
      if (res.ok) {
        setName('');
        setUsername('');
        setPassword('');
        fetchAdmins();
      } else {
        setMessage('Failed to add administrator');
      }
    } catch {
      setMessage('Error adding administrator');
    }
  };

  const handleDelete = async (user: string) => {
    setMessage('');
    try {
      const res = await fetch(`/api/auth/admins/${user}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAdmins();
      } else {
        setMessage('Failed to delete administrator');
      }
    } catch {
      setMessage('Error deleting administrator');
    }
  };

  const handleCancel = () => {
    setName('');
    setUsername('');
    setPassword('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Administrators</h2>
      {message && <p className="text-red-600 mb-4">{message}</p>}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-6 flex space-x-4">
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
          Add
        </button>
        <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-3 py-1">Name</th>
            <th className="border border-gray-300 px-3 py-1">Username</th>
            <th className="border border-gray-300 px-3 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.username}>
              <td className="border border-gray-300 px-3 py-1">{admin.name}</td>
              <td className="border border-gray-300 px-3 py-1">{admin.username}</td>
              <td className="border border-gray-300 px-3 py-1">
                <button
                  onClick={() => handleDelete(admin.username)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
