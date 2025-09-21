import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/EntitiesForm.module.css";

export default function EntitiesForm({ entity, onUpdate, editable }) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    async function fetchFields() {
      try {
        const res = await fetch("http://localhost:5000/api/entities/fields", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity: entity.name }),
        });
        const data = await res.json();
        setFields(data.fields || []);
      } catch (err) {
        console.error("❌ Error fetching fields for", entity.name, err);
      }
    }
    fetchFields();
  }, [entity.name]);

  const updateFieldName = (index, name) => {
    const updated = [...fields];
    updated[index].name = name;
    setFields(updated);
    onUpdate({ name: entity.name, fields: updated });
  };

  const updateFieldType = (index, type) => {
    const updated = [...fields];
    updated[index].type = type;
    setFields(updated);
    onUpdate({ name: entity.name, fields: updated });
  };

  const removeField = (index) => {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated);
    onUpdate({ name: entity.name, fields: updated });
  };

  const addField = () => {
    const updated = [...fields, { name: "NewField", type: "text" }];
    setFields(updated);
    onUpdate({ name: entity.name, fields: updated });
  };

  return (
    <div className={styles.entityForm}>
      <h3>{entity.name} Form</h3>

      {fields.length > 0 ? (
        <form>
          {fields.map((field, i) => (
            <div key={i} className={styles.formField}>
              {editable ? (
                <>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateFieldName(i, e.target.value)}
                    className={styles.editField}
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateFieldType(i, e.target.value)}
                    className={styles.typeSelect}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="date">Date</option>
                  </select>
                  <button type="button" onClick={() => removeField(i)} className={styles.deleteBtn}>
                    ❌
                  </button>
                </>
              ) : (
                <>
                  <label>{field.name}:</label>
                  <input type={field.type} placeholder={field.name} />
                </>
              )}
            </div>
          ))}

          {editable && (
            <button type="button" onClick={addField} className={styles.submitBtn}>
              ✚ Add Field
            </button>
          )}

          {!editable && (
            <button type="submit" className={styles.submitBtn} disabled>
              Submit {entity.name}
            </button>
          )}
        </form>
      ) : (
        <p>Loading fields...</p>
      )}
    </div>
  );
}

EntitiesForm.propTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
      })
    ),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
};
