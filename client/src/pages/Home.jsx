import { useState } from "react";

import RequirementForm from "../components/RequirementForm";
import RequirementsSummary from "../RequirementSummary";
import GeneratedUI from "../components/GeneratedUI";

export default function Home() {

  const [requirements, setRequirements] = useState(null);
  const [editable, setEditable] = useState(false);

  const handleExtracted = (data) => {
      setRequirements(data);
  };

  const handleUpdateRoles = (updatedRoles) => {
    setRequirements((prev) => ({
      ...prev,
      roles: updatedRoles,
    }));
  };

  const handleUpdateEntityFields = (updatedEntity) => {
    setRequirements((prev) => {
      if (!prev) return prev;

      const updatedEntities = prev.entities.map((entity) =>
        entity.name === updatedEntity.name ? updatedEntity : entity
      );

      return { ...prev, entities: updatedEntities };
    });
  };

  console.log("Inside Home.jsx, here is the requirements: ", requirements);
  return (
    <div className="min-h-screen bg-gray-950 text-white flex-col items-center justify-center">
      
      <RequirementForm onExtracted={handleExtracted}/>

      <RequirementsSummary requirements={requirements} />

      {requirements && (
        <div className="mt-12 w-full max-w-4xl">

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setEditable(!editable)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              {editable ? "Switch to Preview Mode" : "Switch to Edit Mode"}
            </button>
          </div>

          <GeneratedUI
            appName={requirements.appName}
            entities={requirements.entities}
            roles={requirements.roles}
            uiElements={requirements.uiElements}
            editable={editable}
            onUpdateRoles={handleUpdateRoles}
            onUpdateEntityFields={handleUpdateEntityFields}
          />
        </div>
      )}
    </div>
  );
}
