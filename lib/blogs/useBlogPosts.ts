"use client";

import { useCallback, useEffect, useState } from "react";
import type { BlogPost } from "./store";

type BlogsApiResponse = {
  ok?: boolean;
  posts?: BlogPost[];
};

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      try {
        const response = await fetch("/api/blogs");
        const body = (await response.json()) as BlogsApiResponse;
        if (cancelled) {
          return;
        }
        if (response.status === 200 && body.ok && body.posts) {
          setPosts(body.posts);
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
    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const updatePost = useCallback((oldSlug: string, post: BlogPost) => {
    setPosts((previous) =>
      previous
        ? previous.map((item) => (item.slug === oldSlug ? post : item))
        : previous
    );
  }, []);

  const removePost = useCallback((slug: string) => {
    setPosts((previous) =>
      previous ? previous.filter((item) => item.slug !== slug) : previous
    );
  }, []);

  return {
    posts,
    loadFailed,
    updatePost,
    removePost,
    reload: () => setReloadKey((key) => key + 1),
  };
}
