import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonSearchbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { Loader } from '../components/Loader';
import './Pages.css';
import { Node } from '../types';
import { buildNodesBySearchQuery } from '../graphql';
import { Toolbar } from '../components/Toolbar';
import { NodeItem } from '../components/Item/NodeItem';

export function SearchNode() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    if (!search) {
      setNodes([]);
      return;
    }
    setIsLoading(true);
    axios
      .post(process.env.REACT_APP_GRAPHQL_URL!, {
        query: buildNodesBySearchQuery(search),
      })
      .then((response) => setNodes(response.data.data.nodesBySearch))
      .finally(() => setIsLoading(false));
  }, [search, setIsLoading]);

  return (
    <>
      {isLoading && <Loader />}
      <IonPage>
        <IonHeader>
          <Toolbar />
          <IonToolbar>
            <IonSearchbar
              placeholder="Search a node"
              value={input}
              onIonChange={(event) =>
                setInput(event.target?.value?.toString() || '')
              }
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  setSearch(input);
                }
              }}
              onIonBlur={() => setSearch(input)}
              onIonClear={() => setSearch('')}
            />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="inner">
            <div className="items">
              {nodes.map((node, index) => (
                <NodeItem
                  key={index}
                  node={node}
                  onClick={() => history.push(`/node/${node.node_id}`)}
                />
              ))}
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
