import { useState } from "react";

import RequirementForm from "../components/RequirementForm";
import RequirementsSummary from "../components/RequirementSummary";
import GeneratedUI from "../components/GeneratedUI";
import ChatUI from "../components/ChatUI";
import ColorSidebar from "../components/ColorSideBar";
import { DndContext } from "@dnd-kit/core";

import styles from "../styles/global.css"

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
    <div className="min-h-screen bg-gray-950 text-white flex-col w-window items-center justify-center">

      <div flex flex-col>
        <RequirementForm onExtracted={handleExtracted} />

        <RequirementsSummary requirements={requirements} />
      </div>

      {/* {requirements &&  */}
      <DndContext>
        <ColorSidebar />
      </DndContext>
      {/*} */}


      {requirements && (

        <div className="flex flex-col justify-between items-center mb-4 mt-12 w-window">

          <div className="flex flex-row justify-end mb-4">
            <button
              onClick={() => setEditable(!editable)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              {editable ? "Switch to Preview Mode" : "Switch to Edit Mode"}
            </button>
          </div>

          <div className="flex flex-row w-screen border border-[var(--nectar-accent-color)]">
            <GeneratedUI
              appName={requirements.appName}
              entities={requirements.entities}
              roles={requirements.roles}
              uiElements={requirements.uiElements}
              editable={editable}
              onUpdateRoles={handleUpdateRoles}
              onUpdateEntityFields={handleUpdateEntityFields}
            />

            <ChatUI
              requirement={requirements}
              onUpdated={(updated) => setRequirements(updated)}
            />
          </div>

        </div>
      )}
    </div>
  );
}
