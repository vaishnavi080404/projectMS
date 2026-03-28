import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import toast from 'react-hot-toast';

export default function App() {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { fetchProjects(currentPage); }, [currentPage]);

    const fetchProjects = async (page) => {
        const res = await axios.get(`http://localhost:5000/api/projects?page=${page}&limit=6`);
        setProjects(res.data.projects);
        setTotalPages(res.data.totalPages);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/projects', newProject);
            toast.success("Project Created!");
            setShowModal(false);
            setNewProject({ name: '', description: '' });
            fetchProjects(currentPage);
        } catch (err) { toast.error("Check input validation"); }
    };

    const confirmDelete = async () => {
        await axios.delete(`http://localhost:5000/api/projects/${projectToDelete}`);
        toast.success("Project Deleted");
        setShowDeleteModal(false);
        fetchProjects(currentPage);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto pt-32 px-8 pb-32">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20">
        <p className="text-blue-600 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Projects</p>
        <h4 className="text-3xl font-black text-blue-700 dark:text-blue-400">{projects.length}</h4>
    </div>
    <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-100 dark:border-emerald-500/20">
        <p className="text-emerald-600 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
        <h4 className="text-3xl font-black text-emerald-700 dark:text-emerald-400">Lead Active</h4>
    </div>
    <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-600/10 border border-purple-100 dark:border-purple-500/20">
        <p className="text-purple-600 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Page View</p>
        <h4 className="text-3xl font-black text-purple-700 dark:text-purple-400">{currentPage} of {totalPages}</h4>
    </div>
</div>

                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-4xl font-bold tracking-tight">Projects</h2>
                    <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20">+ Create Project</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(p => (
                        <ProjectCard key={p._id} project={p} onDelete={() => {setProjectToDelete(p._id); setShowDeleteModal(true);}} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-8 mt-20">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-white/5 disabled:opacity-20 font-bold tracking-tighter transition-all uppercase">← Prev</button>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-white/5 disabled:opacity-20 font-bold tracking-tighter transition-all uppercase">Next →</button>
                </div>

                {/* Create Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-[#16161a] border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6">New Project</h2>
                            <form onSubmit={handleCreate}>
                                <input required className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-4 outline-none focus:border-blue-500" placeholder="Project Name" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
                                <textarea className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-6 outline-none h-32 focus:border-blue-500" placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-xl bg-slate-100 dark:bg-white/5 font-bold">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-bold">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                        <div className="bg-white dark:bg-[#1a1a1e] p-10 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl border border-slate-200 dark:border-white/10">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">!</div>
                            <h2 className="text-2xl font-bold mb-2">Delete Project?</h2>
                            <p className="text-gray-500 text-sm mb-8">This will remove all associated tasks permanently.</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={confirmDelete} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold">Yes, Delete</button>
                                <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-100 dark:bg-white/5 rounded-2xl font-bold">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}