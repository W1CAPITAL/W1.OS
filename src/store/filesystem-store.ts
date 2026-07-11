import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FSItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string;
  updatedAt: number;
}

interface FSState {
  items: FSItem[];
  currentPathId: string | null;
  
  createItem: (name: string, type: 'file' | 'folder', parentId: string | null, content?: string) => void;
  deleteItem: (id: string) => void;
  renameItem: (id: string, newName: string) => void;
  navigateTo: (id: string | null) => void;
}

const INITIAL_FS: FSItem[] = [
  { id: 'root-docs', name: 'Documents', type: 'folder', parentId: null, updatedAt: Date.now() },
  { id: 'root-models', name: 'AI_Models', type: 'folder', parentId: null, updatedAt: Date.now() },
  { id: 'welcome-txt', name: 'README.txt', type: 'file', parentId: null, content: 'Welcome to Aston Martin Linux (Vanquish Linux Edition).\n\nBuilt for high-performance and luxury.', updatedAt: Date.now() },
];

export const useFileSystemStore = create<FSState>()(
  persist(
    (set) => ({
      items: INITIAL_FS,
      currentPathId: null,

      createItem: (name, type, parentId, content) => set(state => ({
        items: [...state.items, { id: Math.random().toString(36).substring(7), name, type, parentId, content, updatedAt: Date.now() }]
      })),
      
      deleteItem: (id) => set(state => ({
        items: state.items.filter(i => i.id !== id)
      })),

      renameItem: (id, newName) => set(state => ({
        items: state.items.map(i => i.id === id ? { ...i, name: newName, updatedAt: Date.now() } : i)
      })),

      navigateTo: (currentPathId) => set({ currentPathId }),
    }),
    { name: 'aml-filesystem' }
  )
);