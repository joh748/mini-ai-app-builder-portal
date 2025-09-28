import { useState } from "react";
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
  // "Sidebar",
  // "SearchBar",
  // "DashboardSummary",
  "EntitiesForm",
  // "DataTableView",
  // "ActionButton",
  // "HomepageImage",
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
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = elements.findIndex((_, i) => i === active.id);
    const newIndex = elements.findIndex((_, i) => i === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setElements((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const known = [];
  const unknown = [];

  uiElements.forEach((e) => {
    if (COMPONENT_MAP[e.type]) {
      known.push(e);
    } else {
      unknown.push(e);
    }
  });

  const sortedKnown = known.sort(
    (a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type)
  );

  const sortedUi = [...sortedKnown, ...unknown];
  const [elements, setElements] = useState(sortedUi);

  console.log("Inside GeneratedUI.jsx, here is elements: \n", elements);

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
            items={elements.map((_, idx) => idx)}
            strategy={verticalListSortingStrategy}
          >
            {elements.map((el, idx) => {
              const Component = COMPONENT_MAP[el.type] || Placeholder;

              const extraProps =
                el.type === "RolesMenu"
                  ? { roles, activeRole, onSelect: setActiveRole, onUpdate: onUpdateRoles }
                  : el.type === "EntitiesForm"
                    ? { onUpdate: onUpdateEntityFields }
                    : {};

              const entityName = el.props.forEntities
                ? el.props.forEntities[0]
                : el.props.entity;

              const matchedEntity = entities?.find((e) => e.name === entityName);

              return (
                <SortableItem key={idx} id={idx}>
                  <Component
                    key={idx}
                    {...el.props}
                    entity={el.props.forEntities ? el.props.forEntities[0] : el.props.entity}
                    initialFields={matchedEntity?.fields || []}
                    editable={editable}
                    originalType={el.type}
                    availableTypes={Object.keys(COMPONENT_MAP)}
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
  editable: PropTypes.bool,
  onUpdateRoles: PropTypes.func,
  onUpdateEntityFields: PropTypes.func,
};
