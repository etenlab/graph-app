import {
  IonContent,
  IonPage,
  IonHeader,
  IonLabel,
  IonInput,
} from '@ionic/react';
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import classnames from 'classnames';

import { Loader } from '../components/Loader';
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
  fromNode: Node;
  toNode: Node;
};

type RelationshipPropertyKey = {
  property_key: string;
  values: RelationshipPropertyValue[];
};

type RelationshipPropertyValue = {
  property_value: PropertyValue;
};

const nodeFields = `
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
`;

const relationshipFields = `
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
  fromNode {
    ${nodeFields}
  }
  toNode {
    ${nodeFields}
  }
`;

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <Loader />}
      {!selectedNodeId ? (
        <SearchScreen
          setIsLoading={setIsLoading}
          onNodeIdSelect={setSelectedNodeId}
        />
      ) : (
        <NodeDetailsScreen
          setIsLoading={setIsLoading}
          nodeId={selectedNodeId}
          onNodeIdSelect={setSelectedNodeId}
        />
      )}
    </>
  );
}

function SearchScreen({
  setIsLoading,
  onNodeIdSelect,
}: {
  setIsLoading(value: boolean): void;
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
    setIsLoading(true);
    axios
      .post('http://localhost:3000/graphql', {
        query: `
          query {
            nodesBySearch(search: "${search}") {
              ${nodeFields}
            }
          }
        `,
      })
      .then((response) => setNodes(response.data.data.nodesBySearch))
      .finally(() => setIsLoading(false));
  }, [search, setIsLoading]);

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

function NodeDetailsScreen({
  setIsLoading,
  nodeId,
  onNodeIdSelect,
}: {
  setIsLoading(value: boolean): void;
  nodeId: number;
  onNodeIdSelect(node_id: number): void;
}) {
  const [node, setNode] = useState<null | Node>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .post('http://localhost:3000/graphql', {
        query: `
          query {
            node(id: ${nodeId}) {
              ${nodeFields}
              relationships {
                ${relationshipFields}
              }
            }
          }
        `,
      })
      .then((response) => setNode(response.data.data.node))
      .finally(() => setIsLoading(false));
  }, [nodeId, setIsLoading]);

  return (
    <IonPage>
      <IonContent fullscreen>
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
                              onNodeIdSelect(relationshipNode.node_id)
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
  );
}

function NodeItem({
  node: { node_type, propertyKeys },
  warning = false,
  showRelation,
  onClick,
}: {
  node: Node;
  warning?: boolean;
  showRelation?: boolean;
  onClick?: () => void;
}) {
  return (
    <Item
      warning={warning}
      type={node_type}
      showRelation={showRelation}
      propertyKeys={propertyKeys}
      onClick={onClick}
    />
  );
}

function RelationshipItem({
  relationship: { relationship_type, propertyKeys },
}: {
  relationship: Relationship;
}) {
  return <Item success type={relationship_type} propertyKeys={propertyKeys} />;
}

function Item({
  type,
  propertyKeys,
  success = false,
  warning = false,
  onClick,
  showRelation = false,
}: {
  type: string;
  propertyKeys: Node['propertyKeys'] | Relationship['propertyKeys'];
  success?: boolean;
  warning?: boolean;
  onClick?: () => void;
  showRelation?: boolean;
}) {
  return (
    <div
      className={classnames('item', {
        'item--success': success,
        'item--warning': warning,
        'item--selectable': onClick,
        'item--relation': showRelation,
      })}
      onClick={onClick}
    >
      {showRelation && (
        <svg viewBox="0 0 50 50" className="item_arrow">
          <path d="M14 0 L14 36 L42 36 L42 39 L48 35 L42 31 L42 34 L16 34 L16 0 Z" />
        </svg>
      )}
      <div>{type}</div>
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
