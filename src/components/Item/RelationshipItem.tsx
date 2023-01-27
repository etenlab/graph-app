import { Relationship } from '../../types';
import { Item } from '.';

export function RelationshipItem({
  relationship: { relationship_type, propertyKeys },
}: {
  relationship: Relationship;
}) {
  return <Item success type={relationship_type} propertyKeys={propertyKeys} />;
}
