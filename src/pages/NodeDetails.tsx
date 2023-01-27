import { IonContent, IonPage, IonHeader, IonLabel } from '@ionic/react';
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

import { Loader } from '../components/Loader';
import { Toolbar } from '../components/Toolbar';
import { NodeItem } from '../components/Item/NodeItem';
import { RelationshipItem } from '../components/Item/RelationshipItem';
import { Node } from '../types';
import { buildNodeQuery } from '../graphql';

export function NodeDetails() {
  const history = useHistory();
  const { nodeId } = useParams<{ nodeId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [node, setNode] = useState<null | Node>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .post('http://localhost:3000/graphql', {
        query: buildNodeQuery(nodeId),
      })
      .then((response) => setNode(response.data.data.node))
      .finally(() => setIsLoading(false));
  }, [nodeId, setIsLoading]);

  return (
    <>
      {isLoading && <Loader />}
      <IonPage>
        <IonHeader>
          <Toolbar />
        </IonHeader>
        <IonContent>
          <div className="inner">
            {node && (
              <>
                <IonLabel className="label">selected node</IonLabel>
                <NodeItem node={node} warning />
                {node.relationships && node.relationships.length > 0 && (
                  <div style={{ marginTop: 15 }}>
                    <IonLabel className="label">relationships</IonLabel>
                    <div>
                      {node.relationships.map((relationship, index) => {
                        const relationshipNode =
                          relationship.fromNode.node_id !== node.node_id
                            ? relationship.fromNode
                            : relationship.toNode;

                        return (
                          <Fragment key={index}>
                            <RelationshipItem relationship={relationship} />
                            <NodeItem
                              node={relationshipNode}
                              warning
                              showRelation
                              onClick={() =>
                                history.push(
                                  `/node/${relationshipNode.node_id}`,
                                )
                              }
                            />
                          </Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
