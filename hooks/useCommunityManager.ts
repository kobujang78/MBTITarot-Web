import { useState } from 'react';
import { Post } from '../types';

export const useCommunityManager = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [boardRefreshKey, setBoardRefreshKey] = useState(0);

  return {
    selectedPost, setSelectedPost,
    isPostEditorOpen, setIsPostEditorOpen,
    editingPost, setEditingPost,
    boardRefreshKey, setBoardRefreshKey
  };
};
