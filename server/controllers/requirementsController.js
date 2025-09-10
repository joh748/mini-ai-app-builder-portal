// server/controllers/requirementsController.js
import Requirement from '../models/Requirement.js';

export const extractRequirements = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);
    const { description } = req.body;

    if (!description) {
      console.log("❌ No description received");
      return res.status(400).json({ error: 'Description is required' });
    }

    // @todo: connect to Gemini API, request and get response, may need to parse the response
    /** 
     * #################################################
     * for the forms, save input fields from Gemini API? 
     * #################################################
     *  */ 
    const mockExtracted = {
      appName: 'Course Manager',
      entities: ['Student', 'Course', 'Grade'],
      roles: ['Teacher', 'Student', 'Admin'],
      features: ['Add course', 'Enrol Students', 'View reports'],
    };

    const newReq = new Requirement({
      description,
      appName: mockExtracted.appName,
      entities: mockExtracted.entities,
      roles: mockExtracted.roles,
      features: mockExtracted.features,
    });
    console.log("💾 Saving requirement:", newReq);
    
    await newReq.save(); // save to DB

    res.json(newReq);
  } catch (err) {
    console.error('❌ Error extracting requirements:', err);
    res.status(500).json({ error: 'extractRequirements Server error' });
  }
};

export const listRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find();
    res.json(requirements);
  } catch (err) {
    console.error('❌ Error listing requirements:', err);
    res.status(500).json({ error: 'listRequirements Server error' });
  }
};
