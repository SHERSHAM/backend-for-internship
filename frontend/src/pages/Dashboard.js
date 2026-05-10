import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { api } from '../utils/api';
import TaskModal from '../components/TaskModal';

const statusBadge = (s) => {
  const map = { 'todo': 'badge-todo', 'in-progress': 'badge-in-progress', 'done': 'badge-done' };
  const labels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
  return <span className={`badge ${map[s]}`}>{labels[s]}</span>;
};

const priorityBadge = (p) => {
  const map = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
  return <span className={`badge ${map[p]}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await api.getTasks();
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCreate = async (form) => {
    const data = await api.createTask(form);
    setTasks(prev => [data.task, ...prev]);
    flash('Task created successfully!');
  };

  const handleUpdate = async (form) => {
    const data = await api.updateTask(editTask._id, form);
    setTasks(prev => prev.map(t => t._id === editTask._id ? data.task : t));
    flash('Task updated successfully!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      flash('Task deleted.');
    } catch (err) {
      setError(err.message);
    }
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="app">
      <nav className="navbar">
        <span className="navbar-brand"><span className="brand">Prime</span>Trade</span>
        <div className="navbar-right">
          <div className="user-badge">
            {user?.name} · <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{user?.role}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="stats-grid">
          <div className="stat-card indigo"><div className="stat-label">Total Tasks</div><div className="stat-value">{stats.total}</div></div>
          <div className="stat-card amber"><div className="stat-label">To Do</div><div className="stat-value">{stats.todo}</div></div>
          <div className="stat-card rose"><div className="stat-label">In Progress</div><div className="stat-value">{stats.inProgress}</div></div>
          <div className="stat-card green"><div className="stat-label">Done</div><div className="stat-value">{stats.done}</div></div>
        </div>

        <div className="tasks-section">
          <div className="tasks-section-header">
            <h3>Tasks {user?.role === 'admin' && '(All Users)'}</h3>
            <button className="btn btn-primary btn-sm" style={{ width: 'auto' }}
              onClick={() => { setEditTask(null); setShowModal(true); }}>
              + New Task
            </button>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>No tasks yet. Create your first one!</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  {user?.role === 'admin' && <th>Owner</th>}
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    <td>
                      <div style={{ fontWeight: 500, color: '#e2e8f0' }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{task.description.slice(0, 60)}{task.description.length > 60 ? '...' : ''}</div>}
                    </td>
                    {user?.role === 'admin' && <td>{task.user?.name || 'N/A'}</td>}
                    <td>{statusBadge(task.status)}</td>
                    <td>{priorityBadge(task.priority)}</td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditTask(task); setShowModal(true); }}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => setShowModal(false)}
          onSave={editTask ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
}
