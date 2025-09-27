import { useState } from "react";
import PropTypes from "prop-types";
import RolesMenu from "./RolesMenu";
import EntitiesForm from "./EntitiesForm";
import Placeholder from "./Placeholder";
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
  editable,
  onUpdateRoles,
  onUpdateEntityFields,
}) {

  const [activeRole, setActiveRole] = useState(null);

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{appName} - Generated UI</h2>

      <div className={styles.generatedSection}>
        {sortedUi.map((el, idx) => {
          const Component = COMPONENT_MAP[el.type] || Placeholder;

          const extraProps =
            el.type === "RolesMenu"
              ? {
                activeRole,
                onSelect: setActiveRole,
                onUpdate: onUpdateRoles,
              }
              : el.type === "EntitiesForm"
                ? {
                  onUpdate: onUpdateEntityFields,
                }
                : {};

          return (
            <Component
              key={idx}
              {...el.props}
              entity={
                el.props.forEntities ? el.props.forEntities[0] : el.props.entity
              }
              editable={editable}
              originalType={el.type}
              availableTypes={Object.keys(COMPONENT_MAP)}
              {...extraProps}
            />
          );
        })}
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
