import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onDelete }) => {
    return (
        <div className="group relative p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                {/* Adaptive Text Color: Slate in Light, White in Dark */}
                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">
                    {project.name}
                </h3>
                <button 
                    onClick={() => onDelete(project._id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                    ✕
                </button>
            </div>
            {/* Adaptive Description Color */}
            <p className="text-slate-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                {project.description || "No description provided."}
            </p>
            <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-gray-500 font-bold">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                </span>
                
                <Link 
                    to={`/project/${project._id}`} 
                    className="px-4 py-2 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                    View Tasks
                </Link>
            </div>
        </div>
    );
};

export default ProjectCard;