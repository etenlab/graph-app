export type Node = {
  node_id: number;
  node_type: string;
  propertyKeys: NodePropertyKey[];
  relationships?: Relationship[];
};

export type NodePropertyKey = {
  property_key: string;
  upVotes: number;
  downVotes: number;
  posts: Post[];
  values: NodePropertyValue[];
};

export type NodePropertyValue = {
  property_value: PropertyValue;
  upVotes: number;
  downVotes: number;
  posts: Post[];
};

export type PropertyValue = {
  value: string;
};

export type Relationship = {
  relationship_id: number;
  relationship_type: string;
  from_node_id: number;
  to_node_id: number;
  propertyKeys: RelationshipPropertyKey[];
  fromNode: Node;
  toNode: Node;
};

export type RelationshipPropertyKey = {
  property_key: string;
  upVotes: number;
  downVotes: number;
  posts: Post[];
  values: RelationshipPropertyValue[];
};

export type RelationshipPropertyValue = {
  property_value: PropertyValue;
  upVotes: number;
  downVotes: number;
  posts: Post[];
};

export type Post = {
  id: number;
};
