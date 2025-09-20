// client/components/GeneratedUI.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import RolesMenu from "./RolesMenu";
import EntitiesForm from "./EntitiesForm";
import styles from "../styles/GeneratedUI.module.css";

export default function GeneratedUI({ appName, entities, roles }) {
  const [activeRole, setActiveRole] = useState(roles[0] || "");

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{appName} - Generated UI</h2>
      
      <div className={styles.roles}>
        <RolesMenu roles={roles} activeRole={activeRole} onSelect={setActiveRole} />
      </div>
      
      <div className={styles.entities}>
        {entities.map((entity) => (
          <EntitiesForm key={entity} entity={entity} />
        ))}
      </div>
    </div>
  );
}

GeneratedUI.propTypes = {
  appName: PropTypes.string.isRequired,
  entities: PropTypes.arrayOf(PropTypes.string).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
