import { forwardRef } from "react";

export interface MenuItemProps {
  category: string;
  name: string;
}

export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
  ({ category, name }, ref) => {
    return (
      <li className="menu-item" ref={ref}>
        <div className="item-category">
          <p>{category}</p>
        </div>
        <div className="item-name">
          <p>{name}</p>
        </div>
      </li>
    );
  }
);

MenuItem.displayName = "MenuItem";
