import { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import styles from "../styles/ColorSideBar.module.css";

function oklchString({ l, c, h }) {
  return `oklch(${l}% ${c} ${h})`;
}

const defaultColors = {
  accent: { l: 69.577, c: 0.20423, h: 43.479 },
  bg1: { l: 27.201, c: 0.01896, h: 225.473 },
  bg2: { l: 45.678, c: 0.00005, h: 271.152 },
  text: { l: 100, c: 0.00011, h: 271.152 },
};

export default function ColorSideBar() {
  const [colors, setColors] = useState(defaultColors);
  const [openGroup, setOpenGroup] = useState(null);
  const [minimized, setMinimized] = useState(true);

  const [basePosition, setBasePosition] = useState({ x: 100, y: 100 });

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: "floating-color-picker",
    activationConstraint: {
      distance: 10,
    },
  });

  const style = {
    position: "fixed",
    zIndex: 9999,
    left: 0,
    top: 0,
    transform: transform
      ? `translate3d(${basePosition.x + transform.x}px, ${basePosition.y + transform.y}px, 0)`
      : `translate3d(${basePosition.x}px, ${basePosition.y}px, 0)`,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const handleDragEnd = () => {
    if (!transform) return;
    setBasePosition((prev) => ({
      x: prev.x + transform.x,
      y: prev.y + transform.y,
    }));
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--brand-color-ui-generated",
      oklchString(colors.accent)
    );
    document.documentElement.style.setProperty(
      "--bg-color-1-ui-generated",
      oklchString(colors.bg1)
    );
    document.documentElement.style.setProperty(
      "--bg-color-2-ui-generated",
      oklchString(colors.bg2)
    );
    document.documentElement.style.setProperty(
      "--text-color-1-ui-generated",
      oklchString(colors.text)
    );
  }, [colors]);

  const updateColor = (key, field, value) => {
    setColors((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: parseFloat(value) },
    }));
  };

  const renderSliders = (key, label) => (
    <div className={styles.colorGroup} key={key}>
      <button
        className={styles.groupHeader}
        onClick={() => setOpenGroup(openGroup === key ? null : key)}
      >
        {label} {openGroup === key ? "▲" : "▼"}
      </button>
      {openGroup === key && (
        <div className={styles.sliders}>
          {["l", "c", "h"].map((field) => (
            <label key={field}>
              {field.toUpperCase()}
              <input
                type="range"
                value={colors[key][field]}
                onChange={(e) => updateColor(key, field, e.target.value)}
                min={field === "l" ? 0 : field === "c" ? 0 : 0}
                max={field === "l" ? 100 : field === "c" ? 0.4 : 360}
                step={field === "c" ? 0.0001 : 1}
                className={styles.slider}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div ref={setNodeRef} style={style} onPointerUp={handleDragEnd} {...attributes}>
      <div className={minimized ? styles.minimized : styles.sidebar}>
        
        <div className={styles.groupHeader}>
          <div
            ref={setActivatorNodeRef}
            {...listeners}
            className={styles.dragHandle}
          >
            <span> Color Picker </span>
          </div>          

          {/* Minimize button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // prevent drag interference
              setMinimized((m) => !m);
            }}
            className={styles.minimizeButton}
          >
            {minimized ? "▼" : "▲"}
          </button>
        </div>

        {!minimized && (
          <div className={styles.controls}>
            {renderSliders("accent", "Accent")}
            {renderSliders("bg1", "Background 1")}
            {renderSliders("bg2", "Background 2")}
            {renderSliders("text", "Text")}
            <button
              type="button"
              onClick={() => setColors(defaultColors)}
              className={styles.resetButton}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
