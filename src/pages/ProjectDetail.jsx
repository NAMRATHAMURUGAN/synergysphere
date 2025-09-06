import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { io } from 'socket.io-client';

export default function ProjectDetail(){
  const { id } = useParams();
  const [project,setProject] = useState(null);
  const [tasks,setTasks] = useState([]);
  const [message,setMessage] = useState('');
  const [messages,setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(()=>{ load(); setupSocket(); return ()=> socketRef.current?.disconnect(); }, [id]);

  const setupSocket = () => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('joinProject', id);
    socketRef.current.on('receiveMessage', msg => setMessages(prev => [...prev, msg]));
    socketRef.current.on('taskUpdated', payload => {
      if (payload.projectId === id) loadTasks();
    });
  };

  const load = async () => {
    try {
      const { data } = await API.get(`/projects/${id}`);
      setProject(data);
      loadTasks();
      loadMessages();
    } catch (err) { console.error(err); }
  };

  const loadTasks = async () => {
    const { data } = await API.get(`/tasks/project/${id}`);
    setTasks(data);
  };

  const loadMessages = async () => {
    const { data } = await API.get(`/messages/project/${id}`);
    setMessages(data);
  };

  const addTask = async () => {
    const title = prompt('Task title');
    if (!title) return;
    await API.post('/tasks', { projectId: id, title });
    socketRef.current.emit('taskUpdated', { projectId: id, action: 'created' });
    loadTasks();
  };

  const changeStatus = async (taskId, status) => {
    await API.put(`/tasks/${taskId}`, { status });
    socketRef.current.emit('taskUpdated', { projectId: id, action: 'statusChanged' });
    loadTasks();
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const payload = { projectId: id, content: message };
    await API.post('/messages', payload);
    socketRef.current.emit('sendMessage', { projectId: id, sender: 'You', content: message, timestamp: new Date() });
    setMessage('');
    loadMessages();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{project?.title || 'Project'}</h2>
        <div>
          <button onClick={addTask} className="bg-green-500 text-white px-3 py-1 rounded">Add Task</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-2">Kanban</h3>
          <div className="grid grid-cols-3 gap-4">
            {['To-Do','In Progress','Done'].map(s => (
              <div key={s} className="bg-white p-3 rounded shadow min-h-[200px]">
                <h4 className="font-semibold mb-2">{s}</h4>
                {tasks.filter(t => t.status === s).map(t => (
                  <div key={t._id} className="border p-2 rounded mb-2">
                    <div className="flex justify-between items-center">
                      <strong>{t.title}</strong>
                      <select value={t.status} onChange={e => changeStatus(t._id, e.target.value)}>
                        <option>To-Do</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>
                    </div>
                    <div className="text-xs text-slate-500">Assignee: {t.assigneeId?.name || 'Unassigned'}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold mb-2">Discussion</h3>
          <div className="max-h-[400px] overflow-auto mb-2">
            {messages.map((m,i)=>(
              <div key={i} className="mb-2">
                <div className="text-sm font-medium">{m.senderId?.name || m.sender || 'Someone'}</div>
                <div className="text-sm">{m.content}</div>
                <div className="text-xs text-slate-400">{new Date(m.createdAt || m.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={message} onChange={e=>setMessage(e.target.value)} className="border p-2 rounded flex-1" placeholder="Write a message" />
            <button onClick={sendMessage} className="bg-blue-500 text-white px-3 py-2 rounded">Send</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
