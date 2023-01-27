const nodeFields = `
  node_id
  node_type
  propertyKeys {
    property_key
    upVotes
    downVotes
    posts {
      id
    }
    values {
      property_value {
        value
      }
      upVotes
      downVotes
      posts {
        id
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
    upVotes
    downVotes
    posts {
      id
    }
    values {
      property_value {
        value
      }
      upVotes
      downVotes
      posts {
        id
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

export const buildNodesBySearchQuery = (search: string) => `
  query {
    nodesBySearch(search: "${search}") {
      ${nodeFields}
    }
  }
`;

export const buildNodeQuery = (nodeId: string) => `
  query {
    node(id: ${nodeId}) {
      ${nodeFields}
      relationships {
        ${relationshipFields}
      }
    }
  }
`;
