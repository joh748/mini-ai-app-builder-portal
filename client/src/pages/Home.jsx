import { useState } from "react";

import RequirementForm from "../components/RequirementForm";
import RequirementsSummary from "../RequirementSummary";
import GeneratedUI from "../components/GeneratedUI";

export default function Home() {

  const [requirements, setRequirements] = useState(null);
  const handleExtracted = (data) => {
      setRequirements(data);
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white flex-col items-center justify-center">
      
      <RequirementForm onExtracted={handleExtracted}/>

      <RequirementsSummary requirements={requirements} />

      {requirements && (
        <div className="mt-12 w-full max-w-4xl">
          <GeneratedUI
            appName={requirements.appName}
            entities={requirements.entities}
            roles={requirements.roles}
          />
        </div>
      )}
    </div>
  );
}
