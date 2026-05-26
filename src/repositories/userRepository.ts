import { serverTimestamp } from 'firebase/firestore';
import { BaseRepository } from './baseRepository';
import { AppUser } from '../types/models';
import { col } from '../firebase/collections';

class UserRepository extends BaseRepository<AppUser> {
  constructor() { super(col.users, 'uid'); }

  async ensureUser(params: { uid: string; email: string; displayName?: string; rootEmail?: string }) {
    const existing = await this.getById(params.uid);
    if (existing) return existing;
    const isRoot = params.rootEmail && params.email.toLowerCase() === params.rootEmail.toLowerCase();
    const user: Partial<AppUser> = {
      uid: params.uid,
      email: params.email,
      displayName: params.displayName || params.email,
      role: isRoot ? 'root' : 'user',
      status: isRoot ? 'approved' : 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      approvedAt: isRoot ? serverTimestamp() : null,
      approvedBy: isRoot ? params.uid : null,
      deletedAt: null,
      deletedBy: null,
    };
    await this.setWithId(params.uid, user as AppUser);
    return user as AppUser;
  }
}
export const userRepository = new UserRepository();
