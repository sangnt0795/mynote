import { orderBy, where } from 'firebase/firestore';
import { BaseRepository } from './baseRepository';
import { Topic } from '../types/models';
import { col } from '../firebase/collections';

class TopicRepository extends BaseRepository<Topic> {
  constructor() { super(col.topics, 'topicId'); }
  activeByCategory(categoryId: string) {
    return this.list([
      where('categoryId', '==', categoryId),
      where('active', '==', true),
      where('deletedAt', '==', null),
      orderBy('order', 'asc'),
    ]);
  }
}
export const topicRepository = new TopicRepository();
