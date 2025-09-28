import PropTypes from "prop-types";
import styles from "../styles/RolesMenu.module.css";

export default function RolesMenu({ roles, activeRole, onSelect, editable, onUpdate }) {

  const handleSelect = (role) => {
    if (onSelect) onSelect(role);
  };

  const updateRole = (index, value) => {
    const updated = [...roles];
    updated[index] = value;
    onUpdate && onUpdate(updated);
  };

  const addRole = () => {
    const updated = [...roles, "NewRole"];
    onUpdate && onUpdate(updated);
  };

  const removeRole = (index) => {
    const updated = roles.filter((_, i) => i !== index);
    onUpdate && onUpdate(updated);
  };

  return (
    <div className={styles.rolesMenu}>
      {editable ? (
        <div className={styles.editContainer}>
          {roles.map((role, i) => (
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
        roles.map((role) => (
          <button
            key={role}
            className={`${styles.roleButton} ${
              activeRole === role ? styles.active : ""
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
