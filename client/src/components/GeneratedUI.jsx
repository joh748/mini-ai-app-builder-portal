import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import RolesMenu from "./RolesMenu";
import EntitiesForm from "./EntitiesForm";
import Placeholder from "./Placeholder";
import SortableItem from "./SortableItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import styles from "../styles/GeneratedUI.module.css";

const COMPONENT_MAP = {
  RolesMenu,
  EntitiesForm,
  // Sidebar,
  // SearchBar,
  // DashboardSummary,
  // DataTableView,
  // ActionButton,
  // HomepageImage,
};

const ORDER = [
  "RolesMenu",
  "EntitiesForm",
];

export default function GeneratedUI({
  appName,
  uiElements,
  entities,
  roles,
  editable,
  onUpdateRoles,
  onUpdateEntityFields,
}) {
  const [activeRole, setActiveRole] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      activationConstraint: { distance: 5 },
    })
  );

  // flatMap used for dragging EntitiesForm separately
  const expandedUiElements = useMemo(() => {
    return uiElements.flatMap((el) => {
      if (el.type === "EntitiesForm") {
        return entities.map((entity) => ({
          type: "EntitiesForm",
          props: { entityName: entity.name, fields: entity.fields },
        }));
      }
      return [el];
    });
  }, [uiElements, entities]);

  const [elements, setElements] = useState(expandedUiElements);
  
  useEffect(() => {
    setElements(expandedUiElements);
  }, [expandedUiElements]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = elements.findIndex((_, idx) => `${idx}` === active.id);
    const newIndex = elements.findIndex((_, idx) => `${idx}` === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setElements((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  console.log("Inside GeneratedUI.jsx, here is elements (persisted):", elements);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{appName} - Generated UI</h2>

      <div className={styles.generatedSection}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={elements.map((_, idx) => `${idx}`)}
            strategy={verticalListSortingStrategy}
          >
            {elements.map((el, idx) => {
              const Component = COMPONENT_MAP[el.type] || Placeholder;

              if (el.type === "EntitiesForm") {
                return (
                  <SortableItem key={idx} id={`${idx}`}>
                    <EntitiesForm
                      entity={el.props.entityName}
                      initialFields={el.props.fields}
                      editable={editable}
                      onUpdate={onUpdateEntityFields}
                      originalType={el.type}
                      availableTypes={Object.keys(COMPONENT_MAP)}
                    />
                  </SortableItem>
                );
              }

              const extraProps =
                el.type === "RolesMenu"
                  ? { roles, activeRole, onSelect: setActiveRole, onUpdate: onUpdateRoles }
                  : {};

              return (
                <SortableItem key={idx} id={`${idx}`}>
                  <Component
                    {...el.props}
                    editable={editable}
                    {...extraProps}
                  />
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

GeneratedUI.propTypes = {
  appName: PropTypes.string.isRequired,
  uiElements: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      props: PropTypes.object,
    })
  ).isRequired,
  entities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  roles: PropTypes.array,
  editable: PropTypes.bool,
  onUpdateRoles: PropTypes.func,
  onUpdateEntityFields: PropTypes.func,
};
