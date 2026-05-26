import { orderBy, where } from 'firebase/firestore';
import { BaseRepository } from './baseRepository';
import { Category } from '../types/models';
import { col } from '../firebase/collections';

class CategoryRepository extends BaseRepository<Category> {
  constructor() { super(col.categories, 'categoryId'); }
  activeList() {
    return this.list([where('active', '==', true), where('deletedAt', '==', null), orderBy('order', 'asc')]);
  }
}
export const categoryRepository = new CategoryRepository();
