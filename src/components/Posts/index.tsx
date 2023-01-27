import { IonIcon } from '@ionic/react';
import { chatbox } from 'ionicons/icons';

import './Posts.css';
import { Post } from '../../types';

export function Posts({ posts }: { posts: Post[] }) {
  return (
    <div className="posts">
      <IonIcon icon={chatbox} className="post-icon" />
      {posts.length}
    </div>
  );
}
