import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppMetadata } from './os-store';

interface AppsState {
  installedApps: AppMetadata[];
  installApp: (app: AppMetadata) => void;
  uninstallApp: (id: string) => void;
}

export const DEFAULT_APPS: AppMetadata[] = [
  { id: 'terminal', title: 'AML Terminal', icon: 'terminal', category: 'System', installed: true, description: 'Power at your fingertips.' },
  { id: 'files', title: 'Vanquish Files', icon: 'folder', category: 'System', installed: true, description: 'Elegant file management.' },
  { id: 'browser', title: 'Aston Browser', icon: 'globe', category: 'Internet', installed: true, description: 'Safe and swift web access.' },
  { id: 'store', title: 'Vanquish Store', icon: 'shopping-bag', category: 'Utilities', installed: true, description: 'Expand your AML environment.' },
  { id: 'settings', title: 'AML Settings', icon: 'settings', category: 'System', installed: true, description: 'Personalize your luxury experience.' },
  { id: 'calculator', title: 'Calculator', icon: 'calculator', category: 'Utilities', installed: true, description: 'Precise calculations.' },
  { id: 'editor', title: 'AML Editor', icon: 'file-text', category: 'Productivity', installed: true, description: 'Luxury writing tool.' },
];

export const useAppsStore = create<AppsState>()(
  persist(
    (set) => ({
      installedApps: DEFAULT_APPS,
      installApp: (app) => set(state => ({
        installedApps: [...state.installedApps, { ...app, installed: true }]
      })),
      uninstallApp: (id) => set(state => ({
        installedApps: state.installedApps.filter(a => a.id !== id)
      })),
    }),
    { name: 'aml-installed-apps' }
  )
);