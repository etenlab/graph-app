import { Node } from '../../types';
import { Item } from '.';

export function NodeItem({
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
