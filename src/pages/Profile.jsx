import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Profile(){
  const [user,setUser] = useState(null);
  const [name, setName] = useState('');

  useEffect(()=>{ load(); }, []);
  const load = async ()=> {
    const { data } = await API.get('/auth/me');
    setUser(data); setName(data.name);
  };

  const save = async () => {
    const { data } = await API.put('/auth/me', { name });
    setUser(data);
    alert('Saved');
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      {user && (
        <div className="bg-white p-4 rounded shadow max-w-md">
          <label className="block mb-2">Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded mb-4" />
          <div className="text-sm text-slate-600 mb-4">Email: {user.email}</div>
          <button onClick={save} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      )}
    </div>
  );
}
