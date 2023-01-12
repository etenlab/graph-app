import {
  IonContent,
  IonPage,
  IonHeader,
  IonLabel,
  IonInput,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

import './Home.css';

type Node = {
  node_id: number;
  node_type: string;
  propertyKeys: NodePropertyKey[];
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

const Home: React.FC = () => {
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
          <div className="nodes">
            {nodes.map(({ node_type, propertyKeys }, index) => (
              <div key={index} className="node">
                <div>{node_type}</div>
                {propertyKeys.length > 0 && (
                  <div className="property-keys">
                    {propertyKeys.map(({ property_key, values }, index) => (
                      <div key={index} className="property-key">
                        <div>{property_key}</div>
                        <div className="property-values">
                          {values.map(
                            ({ property_value: { value } }, index) => (
                              <div key={index} className="property-value">
                                {value}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
