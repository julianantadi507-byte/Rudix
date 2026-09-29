import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Folder, Pencil, Trash2 } from "lucide-react";
import { formatRelativeDate } from '@/utils/dateFormatter';

export const ProjectRow = ({ project, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Valeurs par défaut si les données manquent dans la DB
  const progress = project.progression || 0; 
  const status = project.status || "En cours";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group grid grid-cols-[50px_1fr_120px_120px_150px_50px] items-center p-4 bg-white hover:bg-gray-50/50 transition-all relative border-b border-gray-50 last:border-0">
      
      {/* 1. CHECKBOX (Selection) */}
      <div className="flex justify-center">
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded border-gray-300 text-[#633BBC] focus:ring-[#633BBC] cursor-pointer" 
        />
      </div>

      {/* 2. DÉTAILS DU PROJET */}
      <div className="flex items-center gap-4 overflow-hidden pl-6">
        <div className="p-2 bg-[#633BBC]/10 rounded-lg text-[#633BBC] shrink-0">
          <Folder size={20} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold text-gray-800 hover:text-[#633BBC] cursor-pointer truncate">
            {project.nom}
          </span>
          <span className="text-xs text-gray-500 truncate">
            {project.description || "Aucune description"}
          </span>
        </div>
      </div>

      {/* 3. BARRE DE PROGRESSION */}
      <div className="flex flex-col items-center gap-1.5 px-4">
        <span className="text-[10px] font-bold text-gray-600">{progress}%</span>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#633BBC] rounded-full transition-all duration-700" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 4. STATUT */}
      <div className="flex justify-center">
        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
          status === "Terminé" 
          ? "bg-green-50 text-green-600 border-green-100" 
          : "bg-[#633BBC]/5 text-[#633BBC] border-[#633BBC]/10"
        }`}>
          {status}
        </span>
      </div>

      {/* 5. DATE DE CRÉATION */}
      <div className="text-center text-xs text-gray-500 font-medium">
        {formatRelativeDate(project.createdAt || project.created_at)}
      </div>

      {/* 6. MENU ACTIONS */}
      <div className="flex justify-center relative" ref={menuRef}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${showMenu ? 'bg-gray-100 text-[#633BBC]' : 'text-gray-400 hover:text-[#633BBC] hover:bg-gray-100'}`}
        >
          <MoreHorizontal size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] py-2 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { onEdit(project); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil size={14} className="text-[#633BBC]" />
              Modifier le projet
            </button>
            <div className="h-[1px] bg-gray-50 my-1" />
            <button 
              onClick={() => { onDelete(project.id); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};