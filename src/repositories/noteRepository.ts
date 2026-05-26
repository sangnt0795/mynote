import { orderBy, where } from 'firebase/firestore';
import { BaseRepository } from './baseRepository';
import { Note } from '../types/models';
import { col } from '../firebase/collections';

class NoteRepository extends BaseRepository<Note> {
  constructor() { super(col.notes, 'noteId'); }
  myNotes(uid: string) {
    return this.list([where('userId', '==', uid), where('deletedAt', '==', null), orderBy('updatedAt', 'desc')]);
  }
  publicNotes() {
    return this.list([where('visibility', '==', 'public'), where('deletedAt', '==', null), orderBy('updatedAt', 'desc')]);
  }
}
export const noteRepository = new NoteRepository();
