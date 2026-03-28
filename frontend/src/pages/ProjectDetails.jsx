import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Filter, SortAsc, Calendar, User, ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('due_date');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });

    useEffect(() => {
        fetchProject();
        fetchTasks();
    }, [id, statusFilter, sortBy]);

    const fetchProject = async () => {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(res.data);
    };

    const fetchTasks = async () => {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}/tasks`, {
            params: { status: statusFilter, sortBy: sortBy }
        });
        setTasks(res.data);
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/projects/${id}/tasks`, newTask);
            toast.success("Task Added!");
            setShowTaskModal(false);
            setNewTask({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
            fetchTasks();
        } catch (err) { toast.error("Check validation"); }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
        toast.success(`Marked as ${newStatus}`);
        fetchTasks();
    };

    const handleEditTaskSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, editingTask);
        toast.success("Task Updated!");
        setShowEditModal(false);
        fetchTasks();
    };

    const confirmDelete = async () => {
        await axios.delete(`http://localhost:5000/api/tasks/${taskToDelete}`);
        toast.success("Task Deleted");
        setShowDeleteModal(false);
        fetchTasks();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto pt-32 px-8 pb-20">
                <Link to="/" className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-bold mb-2 tracking-tight text-slate-900 dark:text-white">{project?.name}</h2>
                        <p className="text-slate-500 dark:text-gray-500 font-medium">{project?.description}</p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <button onClick={() => setShowTaskModal(true)} className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-blue-600/20 text-white transition-all">
                            <Plus size={18} className="mr-2" /> New Task
                        </button>

                        <div className="flex gap-4 bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-all">
                            <div className="flex items-center px-3 border-r border-slate-200 dark:border-white/10">
                                <Filter size={16} className="text-blue-600 dark:text-blue-400 mr-2" />
                                <select onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-sm focus:outline-none cursor-pointer font-bold">
                                    <option value="" className="dark:bg-slate-900">All Status</option>
                                    <option value="todo" className="dark:bg-slate-900">Todo</option>
                                    <option value="in-progress" className="dark:bg-slate-900">In Progress</option>
                                    <option value="done" className="dark:bg-slate-900">Done</option>
                                </select>
                            </div>
                            <div className="flex items-center px-3">
                                <SortAsc size={16} className="text-purple-600 dark:text-purple-400 mr-2" />
                                <select onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm focus:outline-none cursor-pointer font-bold">
                                    <option value="due_date" className="dark:bg-slate-900">Sort by Date</option>
                                    <option value="priority" className="dark:bg-slate-900">Sort by Priority</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TASK LIST */}
                <div className="grid grid-cols-1 gap-4">
                    {tasks.map(task => (
                        <div key={task._id} className="group flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:bg-slate-100/50 dark:hover:bg-white/[0.07] transition-all duration-300 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-5">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${
                                    task.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-500' : 
                                    task.status === 'in-progress' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-500' : 
                                    'bg-slate-100 dark:bg-gray-500/10 border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-400'
                                }`}>
                                    {task.status === 'done' ? '✓' : task.status === 'in-progress' ? '•' : '○'}
                                </div>
                                <div>
                                    <h4 className={`text-base font-semibold transition-all ${task.status === 'done' ? 'text-slate-400 dark:text-gray-500 line-through' : 'text-slate-800 dark:text-white'}`}>
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-1.5 font-bold uppercase tracking-widest text-[10px]">
                                        <div className="flex items-center text-slate-500 dark:text-gray-500">
                                            <User size={12} className="mr-1.5 opacity-70" /> {task.assigned_to}
                                        </div>
                                        <div className="flex items-center text-slate-500 dark:text-gray-500">
                                            <Calendar size={12} className="mr-1.5 opacity-70" /> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Date'}
                                        </div>
                                        <span className={`${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-500' : 'text-blue-500'}`}>
                                            {task.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <select value={task.status} onChange={(e) => handleUpdateStatus(task._id, e.target.value)} className="bg-transparent text-[11px] font-black uppercase text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-white cursor-pointer focus:outline-none">
                                    <option value="todo" className="dark:bg-slate-900">TODO</option>
                                    <option value="in-progress" className="dark:bg-slate-900">IN PROGRESS</option>
                                    <option value="done" className="dark:bg-slate-900">DONE</option>
                                </select>
                                <button onClick={() => { setEditingTask(task); setShowEditModal(true); }} className="text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-2"><Pencil size={18} /></button>
                                <button onClick={() => { setTaskToDelete(task._id); setShowDeleteModal(true); }} className="text-slate-400 dark:text-gray-500 hover:text-red-500 p-2">✕</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODALS (Updated for Theme) */}
                {/* MODALS (Updated for Theme with Date and Priority) */}
{(showTaskModal || showEditModal) && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] w-full max-w-lg shadow-2xl text-slate-900 dark:text-white transition-all">
            <h2 className="text-2xl font-bold mb-6">{showTaskModal ? 'New Task' : 'Edit Task'}</h2>
            <form onSubmit={showTaskModal ? handleCreateTask : handleEditTaskSubmit}>
                <div className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                        <input required className="w-full mt-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 text-slate-900 dark:text-white" 
                            placeholder="e.g. Design Homepage" value={showTaskModal ? newTask.title : editingTask.title} 
                            onChange={e => showTaskModal ? setNewTask({...newTask, title: e.target.value}) : setEditingTask({...editingTask, title: e.target.value})} />
                    </div>
                    
                    {/* Assignee Input */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assigned To</label>
                        <input className="w-full mt-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 text-slate-900 dark:text-white" 
                            placeholder="e.g. Vaishnavi" value={showTaskModal ? newTask.assigned_to : editingTask.assigned_to} 
                            onChange={e => showTaskModal ? setNewTask({...newTask, assigned_to: e.target.value}) : setEditingTask({...editingTask, assigned_to: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date Input */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                            <input type="date" className="w-full mt-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 text-slate-900 dark:text-white cursor-pointer" 
                                value={showTaskModal ? newTask.due_date : (editingTask.due_date ? new Date(editingTask.due_date).toISOString().split('T')[0] : '')} 
                                onChange={e => showTaskModal ? setNewTask({...newTask, due_date: e.target.value}) : setEditingTask({...editingTask, due_date: e.target.value})} />
                        </div>

                        {/* Priority Selector */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                            <select className="w-full mt-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 text-slate-900 dark:text-white cursor-pointer"
                                value={showTaskModal ? newTask.priority : editingTask.priority} 
                                onChange={e => showTaskModal ? setNewTask({...newTask, priority: e.target.value}) : setEditingTask({...editingTask, priority: e.target.value})}>
                                <option value="low" className="dark:bg-slate-900">Low</option>
                                <option value="medium" className="dark:bg-slate-900">Medium</option>
                                <option value="high" className="dark:bg-slate-900">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Status Selector (Only for Edit) */}
                    {!showTaskModal && (
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                            <select className="w-full mt-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 text-slate-900 dark:text-white cursor-pointer"
                                value={editingTask.status} 
                                onChange={e => setEditingTask({...editingTask, status: e.target.value})}>
                                <option value="todo" className="dark:bg-slate-900">Todo</option>
                                <option value="in-progress" className="dark:bg-slate-900">In-Progress</option>
                                <option value="done" className="dark:bg-slate-900">Done</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-8">
                    <button type="button" onClick={() => {setShowTaskModal(false); setShowEditModal(false);}} className="flex-1 py-4 rounded-xl bg-slate-100 dark:bg-white/5 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
                        {showTaskModal ? 'Add Task' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

                {/* DELETE MODAL (Updated for Theme) */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                        <div className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-white/10 p-10 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">!</div>
                            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Remove Task?</h2>
                            <p className="text-slate-500 dark:text-gray-500 text-sm mb-8">This action cannot be undone.</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={confirmDelete} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold">Yes, Delete</button>
                                <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-100 dark:bg-white/5 rounded-2xl font-bold text-slate-600 dark:text-gray-400">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProjectDetails;