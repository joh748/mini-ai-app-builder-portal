export default function RequirementsSummary({ requirements }) {
  if (!requirements) return null;

  return (
    <div
      className="mt-6 p-4 rounded-lg"
      style={{ backgroundColor: "var(--nectar-extra-color-3)" }}
    >
      <h3
        className="font-bold mb-2"
        style={{ color: "var(--nectar-accent-color)" }}
      >
        AI Captured Requirements
      </h3>

      <p>
        <strong>App Name:</strong> {requirements.appName}
      </p>

      <p className="mt-2 font-semibold">Entities:</p>
      <ul className="list-disc list-inside">
        {requirements.entities?.map((entity, i) => (
          <li key={i}>{entity}</li>
        ))}
      </ul>

      <p className="mt-2 font-semibold">Roles:</p>
      <ul className="list-disc list-inside">
        {requirements.roles?.map((role, i) => (
          <li key={i}>{role}</li>
        ))}
      </ul>

      <p className="mt-2 font-semibold">Features:</p>
      <ul className="list-disc list-inside">
        {requirements.features?.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}
