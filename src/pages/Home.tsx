import {
  IonContent,
  IonPage,
  IonHeader,
  IonLabel,
  IonInput,
  IonLoading,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

import './Home.css';

type Node = {
  node_id: number;
  node_type: string;
  propertyKeys: NodePropertyKey[];
  relationships?: Relationship[];
};

type NodePropertyKey = {
  property_key: string;
  values: NodePropertyValue[];
};

type NodePropertyValue = {
  property_value: PropertyValue;
};

type PropertyValue = {
  value: string;
};

type Relationship = {
  relationship_id: number;
  relationship_type: string;
  from_node_id: number;
  to_node_id: number;
  propertyKeys: RelationshipPropertyKey[];
};

type RelationshipPropertyKey = {
  property_key: string;
  values: RelationshipPropertyValue[];
};

type RelationshipPropertyValue = {
  property_value: PropertyValue;
};

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  if (!selectedNodeId) {
    return <SearchScreen onNodeIdSelect={setSelectedNodeId} />;
  }

  return <NodeDetailsScreen nodeId={selectedNodeId} />;
}

function SearchScreen({
  onNodeIdSelect,
}: {
  onNodeIdSelect(node_id: number): void;
}) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    if (!search) {
      setNodes([]);
      return;
    }
    axios
      .post('http://localhost:3000/graphql', {
        query: `
          query {
            nodesBySearch(search: "${search}") {
              node_id
              node_type
              propertyKeys {
                property_key
                values {
                  property_value {
                    value
                  }
                }
              }
            }
          }
        `,
      })
      .then((response) => setNodes(response.data.data.nodesBySearch));
  }, [search]);

  return (
    <IonPage>
      <IonHeader>
        <div className="inner">
          <IonLabel className="label">Search</IonLabel>
          <IonInput
            type="text"
            value={input}
            className="input"
            onIonChange={(event) =>
              setInput(event.target?.value?.toString() || '')
            }
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                setSearch(input);
              }
            }}
            onIonBlur={() => setSearch(input)}
          />
        </div>
      </IonHeader>
      <IonContent fullscreen>
        <div className="inner">
          <div className="items">
            {nodes.map((node, index) => (
              <NodeItem
                key={index}
                node={node}
                onClick={() => onNodeIdSelect(node.node_id)}
              />
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

function NodeDetailsScreen({ nodeId }: { nodeId: number }) {
  const [node, setNode] = useState<null | Node>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .post('http://localhost:3000/graphql', {
        query: `
          query {
            node(id: ${nodeId}) {
              node_id
              node_type
              propertyKeys {
                property_key
                values {
                  property_value {
                    value
                  }
                }
              }
              relationships {
                relationship_type
                from_node_id
                to_node_id
                propertyKeys {
                  property_key
                  values {
                    property_value {
                      value
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .then((response) => setNode(response.data.data.node))
      .finally(() => setIsLoading(false));
  }, [nodeId]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="inner">
          {isLoading && (
            <IonLoading isOpen showBackdrop={false} cssClass="loader" />
          )}
          {node && (
            <>
              <IonLabel className="label">selected node</IonLabel>
              <NodeItem node={node} highlighted />
              {node.relationships && node.relationships.length > 0 && (
                <div style={{ marginTop: 15 }}>
                  <IonLabel className="label">relationships</IonLabel>
                  <div>
                    {node.relationships.map((relationship, index) => (
                      <RelationshipItem
                        key={index}
                        relationship={relationship}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

function NodeItem({
  node: { node_type, propertyKeys },
  highlighted = false,
  onClick,
}: {
  node: Node;
  highlighted?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={[
        'item',
        ...(onClick ? ['item--selectable'] : []),
        ...(highlighted ? ['item--highlighted'] : []),
      ].join(' ')}
      onClick={onClick}
    >
      <div>{node_type}</div>
      {propertyKeys.length > 0 && (
        <div className="property-keys">
          {propertyKeys.map(({ property_key, values }, index) => (
            <div key={index} className="property-key">
              <div>{property_key}</div>
              <div className="property-values">
                {values.map(({ property_value: { value } }, index) => (
                  <div key={index} className="property-value">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RelationshipItem({
  relationship: { relationship_type, propertyKeys },
}: {
  relationship: Relationship;
}) {
  return (
    <div className="item item--highlighted">
      <div>{relationship_type}</div>
      {propertyKeys.length > 0 && (
        <div className="property-keys">
          {propertyKeys.map(({ property_key, values }, index) => (
            <div key={index} className="property-key">
              <div>{property_key}</div>
              <div className="property-values">
                {values.map(({ property_value: { value } }, index) => (
                  <div key={index} className="property-value">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
