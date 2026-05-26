import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export class BaseRepository<T extends DocumentData> {
  constructor(private collectionName: string, private idField: keyof T) {}

  ref() {
    return collection(db, this.collectionName);
  }

  docRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  async getById(id: string): Promise<T | null> {
    const snap = await getDoc(this.docRef(id));
    return snap.exists() ? (snap.data() as T) : null;
  }

  async list(constraints: QueryConstraint[] = []): Promise<T[]> {
    const snap = await getDocs(query(this.ref(), ...constraints));
    return snap.docs.map((d) => d.data() as T);
  }

  async createAuto(data: Omit<Partial<T>, keyof T>): Promise<string> {
    const ref = await addDoc(this.ref(), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await updateDoc(ref, { [this.idField as string]: ref.id });
    return ref.id;
  }

  async setWithId(id: string, data: Partial<T>) {
    await setDoc(this.docRef(id), {
      ...data,
      [this.idField as string]: id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  async update(id: string, data: Partial<T>) {
    await updateDoc(this.docRef(id), { ...data, updatedAt: serverTimestamp() });
  }

  async softDelete(id: string, uid: string, reason?: string) {
    await updateDoc(this.docRef(id), {
      deletedAt: serverTimestamp(),
      deletedBy: uid,
      ...(reason ? { deleteReason: reason } : {}),
      updatedAt: serverTimestamp(),
    });
  }
}

export const q = { where, orderBy };
