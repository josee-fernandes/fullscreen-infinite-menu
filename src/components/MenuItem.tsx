interface MenuItemProps {
  category: string;
  name: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({ category, name }) => {
  return (
    <li className="menu-item">
      <div className="item-category">
        <p>{category}</p>
      </div>
      <div className="item-name">
        <p>{name}</p>
      </div>
    </li>
  );
};

MenuItem.displayName = "MenuItem";
