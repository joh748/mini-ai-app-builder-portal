import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema({
  description: { type: String, required: true },
  appName: { type: String },
  entities: [{ type: String }],
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
}, { timestamps: true });

export default mongoose.model('Requirement', RequirementSchema);
