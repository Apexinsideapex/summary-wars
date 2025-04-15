export interface StoredEvaluationResult {
  meetingId: number;
  model: "4.1" | "o3-high";
  results: any; // Using any for now since the evaluation result structure is complex
  timestamp: number;
}

const DB_NAME = 'summary-wars';
const STORE_NAME = 'evaluation-results';
const DB_VERSION = 3;  // Incrementing version for schema update

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // If store exists, delete it to recreate with new schema
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      
      // Create store with composite key
      const store = db.createObjectStore(STORE_NAME, { 
        keyPath: ['meetingId', 'model'] 
      });
      
      // Create indexes
      store.createIndex('timestamp', 'timestamp');
      store.createIndex('meetingId', 'meetingId');
      store.createIndex('model', 'model');
    };
  });
}

export async function saveEvaluationResult(meetingId: number, results: any, model: "4.1" | "o3-high"): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const storedResult: StoredEvaluationResult = {
      meetingId,
      model,
      results,
      timestamp: Date.now()
    };

    const request = store.put(storedResult);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getEvaluationResult(meetingId: number, model?: "4.1" | "o3-high"): Promise<StoredEvaluationResult | StoredEvaluationResult[] | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    if (model) {
      // Get specific model result
      const request = store.get([meetingId, model]);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    } else {
      // Get all results for this meeting
      const index = store.index('meetingId');
      const request = index.getAll(meetingId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    }
  });
}

export async function getAllEvaluationResults(): Promise<StoredEvaluationResult[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function clearAllEvaluationResults(): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
} 