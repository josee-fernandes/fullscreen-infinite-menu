import "./styles/global.css";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

import { MenuItem } from "./components/MenuItem";
import { menuItemsData } from "./services/data";
import { lerp } from "./utils/animation";

export const App: React.FC = () => {
  const { contextSafe } = useGSAP();

  const [menuHeight, setMenuHeight] = useState(0);
  const [menuItemHeight, setMenuItemHeight] = useState(0);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const menu = useRef<HTMLDivElement>(null);
  const menuItems = useRef<HTMLLIElement[]>([]);
  const smoothScrollYRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const startYRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const totalMenuHeightRef = useRef(0);

  const createRef = (element: HTMLLIElement | null) => {
    if (element && !menuItems.current.includes(element)) {
      menuItems.current.push(element);
    }
  };

  const updateTotalMenuHeight = () => {
    totalMenuHeightRef.current = menuItems.current.length * menuItemHeight;
  };

  const adjustMenuItemsPosition = contextSafe((scroll: number) => {
    gsap.set(menuItems.current, {
      y: (index: number) => {
        let position = index * menuItemHeight + scroll;

        position = gsap.utils.wrap(
          -menuItemHeight,
          totalMenuHeightRef.current - menuItemHeight,
          position
        );

        return position;
      },
    });
  });

  const onWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    setCurrentScrollPosition(
      (oldCurrentScrollPosition) => oldCurrentScrollPosition - event.deltaY
    );
  };

  const onDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!menu.current) return;

    startYRef.current = event.clientY;
    setIsDragging(true);
    menu.current.classList.add("is-dragging");
  };

  const onDragMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const newY = event.clientY * 5;

    setCurrentScrollPosition(
      (oldCurrentScrollPosition) =>
        oldCurrentScrollPosition + newY - startYRef.current
    );
    startYRef.current = newY;
  };

  const onDragEnd = () => {
    if (!menu.current) return;

    setIsDragging(false);
    menu.current.classList.remove("is-dragging");
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!menu.current) return;

    startYRef.current = event.touches[0].clientY;
    setIsDragging(true);
    menu.current.classList.add("is-dragging");
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const newY = event.touches[0].clientY * 7;

    setCurrentScrollPosition(
      (oldCurrentScrollPosition) =>
        oldCurrentScrollPosition + newY - startYRef.current
    );
    startYRef.current = newY;
  };

  const onTouchEnd = () => {
    if (!menu.current) return;

    setIsDragging(false);
    menu.current.classList.remove("is-dragging");
  };

  const updateMenuHeight = () => {
    setMenuHeight(menu.current?.clientHeight || 0);
  };

  const updateMenuItemHeight = () => {
    setMenuItemHeight(menuItems.current[0].clientHeight);
  };

  const animate = contextSafe(() => {
    smoothScrollYRef.current = lerp(
      smoothScrollYRef.current,
      currentScrollPosition,
      0.1
    );

    adjustMenuItemsPosition(smoothScrollYRef.current);

    const scrollSpeed = smoothScrollYRef.current - lastScrollYRef.current;
    lastScrollYRef.current = smoothScrollYRef.current;

    gsap.to(menuItems.current, {
      scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.0075,
      rotate: scrollSpeed * 0.2,
    });

    animationRef.current = requestAnimationFrame(animate);
  });

  useEffect(() => {
    if (menu.current) {
      setMenuHeight(menu.current.clientHeight);

      window.addEventListener("resize", updateMenuHeight);
    }

    return () => {
      window.removeEventListener("resize", updateMenuHeight);
    };
  }, [menu]);

  useEffect(() => {
    if (menuItems.current.length > 0) {
      setMenuItemHeight(menuItems.current[0].clientHeight);

      window.addEventListener("resize", updateMenuItemHeight);
    }

    return () => {
      window.removeEventListener("resize", updateMenuItemHeight);
    };
  }, [menuItems]);

  // Atualiza totalMenuHeight quando menuItemHeight ou menuItems.current.length mudar
  useEffect(() => {
    updateTotalMenuHeight();
  }, [menuItemHeight, menuItems.current.length]);

  useGSAP(
    () => {
      if (
        menu.current &&
        menuItems.current.length > 0 &&
        menuHeight > 0 &&
        menuItemHeight > 0 &&
        totalMenuHeightRef.current > 0
      ) {
        adjustMenuItemsPosition(0);
      }
    },
    {
      dependencies: [
        menu,
        menuItems,
        menuHeight,
        menuItemHeight,
        totalMenuHeightRef.current,
      ],
    }
  );

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      ref={menu}
      className="menu"
      onWheel={onWheelScroll}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseLeave={onDragEnd}
      onMouseUp={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onSelect={() => false}
    >
      <div className="menu-img">
        <img src="bg.jpg" alt="" />
      </div>

      <ul className="menu-wrapper">
        {menuItemsData.map((item) => (
          <MenuItem key={item.name} {...item} ref={createRef} />
        ))}
      </ul>
    </div>
  );
};

App.displayName = "App";
