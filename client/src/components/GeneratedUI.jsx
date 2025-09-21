import { useState } from "react";
import PropTypes from "prop-types";
import RolesMenu from "./RolesMenu";
import EntitiesForm from "./EntitiesForm";
import styles from "../styles/GeneratedUI.module.css";

export default function GeneratedUI({ appName, entities, roles }) {
  const [activeRole, setActiveRole] = useState(roles[0] || "");
  const [uiConfig, setUiConfig] = useState(
    entities.map((entity) => ({ name: entity, fields: [] }))
  );
  const [editable, setEditable] = useState(true);

  const handleUpdateEntity = (updatedEntity) => {
    setUiConfig((prev) =>
      prev.map((e) => (e.name === updatedEntity.name ? updatedEntity : e))
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{appName} - Generated UI</h2>

      <div className={styles.toggleWrapper}>
        <button
          onClick={() => setEditable(!editable)}
          className={styles.toggleButton}
        >
          {editable ? "Switch to Preview Mode" : "Switch to Edit Mode"}
        </button>
      </div>

      <div className={styles.generatedSection}>

        <div className={styles.roles}>
          <RolesMenu
            roles={roles}
            activeRole={activeRole}
            onSelect={setActiveRole}
          />
        </div>

        <div className={styles.entities}>
          {uiConfig.map((entity) => (
            <EntitiesForm
              key={entity.name}
              entity={entity}
              onUpdate={handleUpdateEntity}
              editable={editable}
            />
          ))}
        </div>
      </div>
      {/* <pre style={{ background: "#111", color: "lime", padding: "1rem" }}>
        {JSON.stringify(uiConfig, null, 2)}
      </pre> */}
    </div>
  );
}

GeneratedUI.propTypes = {
  appName: PropTypes.string.isRequired,
  entities: PropTypes.arrayOf(PropTypes.string).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
