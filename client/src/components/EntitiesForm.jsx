import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/EntitiesForm.module.css"

export default function EntitiesForm({ entity }) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    async function fetchFields() {
      try {
        const res = await fetch("http://localhost:5000/api/entities/fields", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity }),
        });
        const data = await res.json();
        setFields(data.fields || []);
      } catch (err) {
        console.error("❌ Error fetching fields for", entity, err);
      }
    }
    fetchFields();
  }, [entity]);

  return (
    <div className={styles.entityForm}>
      <h3>{entity} Form</h3>
      {fields.length > 0 ? (
        <form>
          {fields.map((field, i) => (
            <div key={i} className={styles.formField}>
              <label>{field.name}</label>
              <input type={field.type} placeholder={field.name} />
            </div>
          ))}
          <button type="submit" className={styles.submitBtn}>
            Submit {entity}
          </button>
        </form>
      ) : (
        <p>Loading fields...</p>
      )}
    </div>
  );
}

EntitiesForm.propTypes = {
  entity: PropTypes.string.isRequired,
};
