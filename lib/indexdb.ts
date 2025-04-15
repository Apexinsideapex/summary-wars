export interface StoredEvaluationResult {
  meetingId: number;
  model: "4.1" | "o3-mini";
  results: any; // Using any for now since the evaluation result structure is complex
  timestamp: number;
}

// --- OVERALL ANALYSIS STORAGE ---
export interface StoredOverallAnalysis {
  meetingId: number;
  analysis: Record<string, any>; // { [model: string]: analysis }
}

const DB_NAME = 'summary-wars';
const STORE_NAME = 'evaluation-results';
const OVERALL_ANALYSIS_STORE = 'overall-analysis';
const DB_VERSION = 4;  // Incremented version for schema update

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
      
      // Ensure both stores exist
      if (!db.objectStoreNames.contains(OVERALL_ANALYSIS_STORE)) {
        db.createObjectStore(OVERALL_ANALYSIS_STORE, { keyPath: 'meetingId' });
      }
    };
  });
}

export async function saveEvaluationResult(meetingId: number, results: any, model: "4.1" | "o3-mini"): Promise<void> {
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

export async function getEvaluationResult(meetingId: number, model?: "4.1" | "o3-mini"): Promise<StoredEvaluationResult | StoredEvaluationResult[] | null> {
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
  const overallDb = await initOverallAnalysisDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      // Also clear overall analysis
      const overallTransaction = overallDb.transaction(OVERALL_ANALYSIS_STORE, 'readwrite');
      const overallStore = overallTransaction.objectStore(OVERALL_ANALYSIS_STORE);
      const overallRequest = overallStore.clear();
      overallRequest.onerror = () => reject(overallRequest.error);
      overallRequest.onsuccess = () => resolve();
    };
  });
}

export async function initOverallAnalysisDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Ensure both stores exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          keyPath: ['meetingId', 'model'] 
        });
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('meetingId', 'meetingId');
        store.createIndex('model', 'model');
      }
      if (!db.objectStoreNames.contains(OVERALL_ANALYSIS_STORE)) {
        db.createObjectStore(OVERALL_ANALYSIS_STORE, { keyPath: 'meetingId' });
      }
    };
  });
}

export async function saveOverallAnalysis(meetingId: number, analysis: Record<string, any>): Promise<void> {
  const db = await initOverallAnalysisDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OVERALL_ANALYSIS_STORE, 'readwrite');
    const store = transaction.objectStore(OVERALL_ANALYSIS_STORE);
    const stored: StoredOverallAnalysis = {
      meetingId,
      analysis
    };
    const request = store.put(stored);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getOverallAnalysis(meetingId: number): Promise<StoredOverallAnalysis | null> {
  const db = await initOverallAnalysisDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OVERALL_ANALYSIS_STORE, 'readonly');
    const store = transaction.objectStore(OVERALL_ANALYSIS_STORE);
    const request = store.get(meetingId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function clearAllOverallAnalysis(): Promise<void> {
  const db = await initOverallAnalysisDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OVERALL_ANALYSIS_STORE, 'readwrite');
    const store = transaction.objectStore(OVERALL_ANALYSIS_STORE);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
} 