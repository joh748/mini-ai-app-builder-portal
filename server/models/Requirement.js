import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema({
  description: { type: String, required: true },
  appName: { type: String },
  entities: [{ type: String }],
  roles: [{ type: String }],
  features: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Requirement', RequirementSchema);
