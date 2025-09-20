import PropTypes from "prop-types";
import styles from "../styles/RolesMenu.module.css";

export default function RolesMenu({ roles, activeRole, onSelect }) {
  return (
    <div className={styles.rolesMenu}>
      {roles.map((role) => (
        <button
          key={role}
          className={`${styles.roleButton} ${activeRole === role ? styles.active : ""}`}
          onClick={() => onSelect(role)}
        >
          {role}
        </button>
      ))}
    </div>
  );
}

RolesMenu.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeRole: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
