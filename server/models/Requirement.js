import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // "text", "number", "email", "date"
  },
  { _id: false }
);

const EntitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fields: { type: [FieldSchema], default: [] },
  },
  { _id: false }
);

const RequirementSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    appName: { type: String },
    entities: { type: [EntitySchema], default: [] },
    roles: [{ type: String }],
    features: [{ type: String }],
    uiElements: [
      {
        type: {
          type: String,
          required: true,
        },
        props: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Requirement", RequirementSchema);
