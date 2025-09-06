import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [projects,setProjects] = useState([]);
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const nav = useNavigate();

  useEffect(()=>{ load(); },[]);
  const load = async ()=> {
    try { const { data } = await API.get('/projects'); setProjects(data); } catch (e) { console.error(e); if(e.response?.status===401) nav('/login'); }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', { title, description: desc });
      setTitle(''); setDesc('');
      load();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div>
          <Link to="/profile" className="mr-4 text-blue-600">Profile</Link>
          <button onClick={()=>{ localStorage.removeItem('token'); nav('/login'); }} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <form onSubmit={create} className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Create Project</h3>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded mb-2" />
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="w-full border p-2 rounded mb-2"></textarea>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
        </form>

        <div className="md:col-span-2">
          <div className="grid gap-4">
            {projects.map(p => (
              <div key={p._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <Link to={`/projects/${p._id}`} className="text-lg font-semibold text-blue-600">{p.title}</Link>
                <p className="text-sm text-slate-600">{p.description}</p>
                </div>
                <div className="text-sm text-slate-500">Members: {p.members?.length ?? 0}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
