import { useState } from "react";
import { projectsAPI } from "../api/projects.api";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async (token) => {
    try {
      const data = await projectsAPI.getAll(token);
      setProjects(data);
    } catch (e) {
      console.error("Erreur de chargement");
    }
  };

  const addProject = async (nom, description, token) => {
    try {
      const newProj = await projectsAPI.create({ nom, description }, token);
      setProjects((prev) => [...prev, newProj]);
      return newProj;
    } catch (e) {
      console.error("Erreur de création");
    }
  };

  return { projects, fetchProjects, addProject };
};