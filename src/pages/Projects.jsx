import React, { useState, useEffect } from "react";
import { useProjects } from "../hooks/useProjects";

export default function Projects() {
  const { projects, fetchProjects, addProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProj, setNewProj] = useState({ nom: '', description: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchProjects(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await addProject(newProj.nom, newProj.description, token);
    setIsModalOpen(false);
    setNewProj({ nom: '', description: '' });
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#633BB8]">Gestion des projets</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#633BB8] text-white px-6 py-2 rounded-full font-bold"
        >
          + Nouveau Projet
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects && projects.map((p) => {
          const ratio = p.tasks_total > 0 ? Math.round((p.tasks_done / p.tasks_total) * 100) : 0;
          return (
            <div key={p.id} className="p-6 rounded-3xl border border-gray-100 shadow-sm bg-white">
              <h3 className="text-xl font-bold mb-2">{p.nom}</h3>
              <p className="text-gray-400 text-sm mb-6">{p.description || "Aucune description"}</p>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-500">Productivité</span>
                  <span className="text-[#633BB8]">{ratio}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#633BB8]" style={{ width: `${ratio}%` }}></div>
                </div>
              </div>
              
              <button className="w-full py-3 border border-[#633BB8] text-[#633BB8] rounded-xl font-bold hover:bg-[#633BB8] hover:text-white transition-colors">
                Ouvrir le kanban
              </button>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Créer un nouveau projet</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Nom du projet"
                className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#633BB8]"
                value={newProj.nom}
                onChange={(e) => setNewProj({...newProj, nom: e.target.value})}
                required
              />
              <textarea 
                placeholder="Description"
                className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#633BB8] h-32"
                value={newProj.description}
                onChange={(e) => setNewProj({...newProj, description: e.target.value})}
              />
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-500 font-bold"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#633BB8] text-white rounded-xl font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}