/**
 * @fileOverview Motor de Persistência Local v99.0 - AML OS Core
 * Gerenciamento de ativos do sistema via IndexedDB.
 */

import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'aml_os_assets';
const STORE_NAME = 'system_vault';

export async function getAssetDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveLocalAsset(key: string, file: Blob): Promise<void> {
  try {
    const db = await getAssetDB();
    await db.put(STORE_NAME, file, key);
  } catch (error) {
    console.error('[STORAGE] Failed to save asset:', error);
  }
}

export async function getLocalAsset(key: string): Promise<Blob | null> {
  try {
    const db = await getAssetDB();
    const asset = await db.get(STORE_NAME, key);
    return asset || null;
  } catch (error) {
    console.error('[STORAGE] Failed to retrieve asset:', error);
    return null;
  }
}

export async function clearLocalAssets(): Promise<void> {
  const db = await getAssetDB();
  await db.clear(STORE_NAME);
}
