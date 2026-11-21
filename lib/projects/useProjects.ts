"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project } from "../projects";

type ProjectsApiResponse = {
  ok?: boolean;
  projects?: Project[];
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");
        const body = (await response.json()) as ProjectsApiResponse;
        if (cancelled) {
          return;
        }
        if (response.status === 200 && body.ok && body.projects) {
          setProjects(body.projects);
          setLoadFailed(false);
        } else {
          setLoadFailed(true);
        }
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
        }
      }
    }
    loadProjects();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const addProject = useCallback((project: Project) => {
    setProjects((previous) =>
      previous ? [...previous, project] : previous
    );
  }, []);

  const updateProject = useCallback((project: Project) => {
    setProjects((previous) =>
      previous
        ? previous.map((item) => (item.slug === project.slug ? project : item))
        : previous
    );
  }, []);

  const removeProject = useCallback((slug: string) => {
    setProjects((previous) =>
      previous ? previous.filter((item) => item.slug !== slug) : previous
    );
  }, []);

  return {
    projects,
    loadFailed,
    addProject,
    updateProject,
    removeProject,
    reload: () => setReloadKey((key) => key + 1),
  };
}
