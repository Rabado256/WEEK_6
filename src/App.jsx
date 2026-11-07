import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App() {
  // Initialize state from localStorage or empty array
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('averon_react_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('averon_react_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handler: Add Task
  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  // Handler: Toggle Task Completion
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handler: Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Handler: Clear Completed Tasks
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Filter tasks based on active filter tab
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="app-container">
      <Header />
      
      <TaskForm onAddTask={addTask} />

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />

      {/* App Footer Summary */}
      <footer className="app-footer">
        <p><span>{activeCount}</span> tasks remaining</p>
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      </footer>
    </div>
  );
}