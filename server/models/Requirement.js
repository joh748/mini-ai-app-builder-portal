import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
});

const entitySchema = new mongoose.Schema({
  name: {type: String, required: true},
  fields: [fieldSchema],
});

const uiElementSchema = new mongoose.Schema({
  type: {type: String, required: true},
  props: mongoose.Schema.Types.Mixed,
});

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const requirementSchema = new mongoose.Schema({
  description: { type: String, required: true },
    appName: { type: String },
  entities: [entitySchema],
    roles: [{ type: String }],
    features: [{ type: String }],
  uiElements: [uiElementSchema],
  chatHistory: [chatMessageSchema],
});

export default mongoose.model("Requirement", requirementSchema);
