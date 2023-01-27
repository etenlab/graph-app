import classnames from 'classnames';

import { Node, Relationship } from '../../types';
import { Votes } from '../Votes';
import { Posts } from '../Posts';
import './Item.css';

export function Item({
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
          {propertyKeys.map(
            ({ property_key, upVotes, downVotes, posts, values }, index) => (
              <div key={index} className="property-key-block">
                <div className="property-key-header">
                  <Votes upVotes={upVotes} downVotes={downVotes} />
                  <Posts posts={posts} />
                  <div className="property-key">{property_key}</div>
                </div>
                <div className="property-values">
                  {values.map(
                    (
                      { property_value: { value }, upVotes, downVotes, posts },
                      index,
                    ) => (
                      <div key={index} className="property-value-block">
                        <Votes upVotes={upVotes} downVotes={downVotes} />
                        <Posts posts={posts} />
                        <div className="property-value">{value}</div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
