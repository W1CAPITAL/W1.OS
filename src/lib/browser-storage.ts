
/**
 * @fileOverview Motor de Persistência Local v98.0 - W1 Capital
 * Gerenciamento de arquivos grandes via IndexedDB para evitar QuotaExceededError.
 */

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'lexis_predict_assets';
const STORE_NAME = 'wallpapers';

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
  const db = await getAssetDB();
  await db.put(STORE_NAME, file, key);
}

export async function getLocalAsset(key: string): Promise<Blob | null> {
  const db = await getAssetDB();
  const asset = await db.get(STORE_NAME, key);
  return asset || null;
}

export async function clearLocalAssets(): Promise<void> {
  const db = await getAssetDB();
  await db.clear(STORE_NAME);
}
