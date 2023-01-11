import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

import './Home.css';

const Home: React.FC = () => {
  const [nodes, setNodes] = useState<{ node_id: number; node_type: string }[]>(
    [],
  );

  useEffect(() => {
    axios
      .post('http://localhost:3000/graphql', {
        query: `
          query {
            nodes {
              node_id
              node_type
            }
          }
        `,
      })
      .then((response) => setNodes(response.data.data.nodes));
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="nodes">
          {nodes.map((node, index) => (
            <div key={index} className="node">
              {node.node_type}
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
