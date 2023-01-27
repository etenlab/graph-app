import { IonIcon } from '@ionic/react';
import { thumbsUp, thumbsDown } from 'ionicons/icons';

import './Votes.css';

export function Votes({
  upVotes,
  downVotes,
}: {
  upVotes: number;
  downVotes: number;
}) {
  return (
    <div className="votes">
      <div className="vote">
        <IonIcon icon={thumbsUp} className="vote-icon" />
        {upVotes}
      </div>
      <div className="vote">
        <IonIcon icon={thumbsDown} className="vote-icon" />
        {downVotes}
      </div>
    </div>
  );
}
