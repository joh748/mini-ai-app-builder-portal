import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../styles/RolesMenu.module.css";

export default function RolesMenu({ roles, activeRole, onSelect, editable, onUpdate }) {
  const [localRoles, setLocalRoles] = useState(roles);

  // pick first role if none selected
  const [localActive, setLocalActive] = useState(activeRole || roles[0]);

  useEffect(() => {
    if (activeRole) {
      setLocalActive(activeRole);
    }
  }, [activeRole]);

  const handleSelect = (role) => {
    setLocalActive(role);
    if (onSelect) onSelect(role);
  };

  const updateRole = (index, value) => {
    const updated = [...localRoles];
    updated[index] = value;
    setLocalRoles(updated);
    onUpdate && onUpdate(updated);
  };

  const addRole = () => {
    const updated = [...localRoles, "NewRole"];
    setLocalRoles(updated);
    onUpdate && onUpdate(updated);
  };

  const removeRole = (index) => {
    const updated = localRoles.filter((_, i) => i !== index);
    setLocalRoles(updated);
    onUpdate && onUpdate(updated);
  };

  return (
    <div className={styles.rolesMenu}>
      {editable ? (
        <div className={styles.editContainer}>
          {localRoles.map((role, i) => (
            <div key={i} className={styles.roleEditRow}>
              <input
                type="text"
                value={role}
                onChange={(e) => updateRole(i, e.target.value)}
                className={styles.roleInput}
              />
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => removeRole(i)}
              >
                ❌
              </button>
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addRole}>
            ✚ Add Role
          </button>
        </div>
      ) : (
        localRoles.map((role) => (
          <button
            key={role}
            className={`${styles.roleButton} ${
              (activeRole || localActive) === role ? styles.active : ""
            }`}
            onClick={() => handleSelect(role)}
          >
            {role}
          </button>
        ))
      )}
    </div>
  );
}

RolesMenu.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeRole: PropTypes.string,
  onSelect: PropTypes.func,
  editable: PropTypes.bool,
  onUpdate: PropTypes.func,
};
