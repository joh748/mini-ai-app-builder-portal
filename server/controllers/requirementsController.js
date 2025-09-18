// server/controllers/requirementsController.js
import Requirement from '../models/Requirement.js';
import { GoogleGenAI, Type } from "@google/genai";

/**@todo use .env file, currently process.env.GEMINI_API_KEY gives undefined */
const genAI = new GoogleGenAI({
  // optionally pass in API key via options or ensure env var is accessible
  // apiKey: process.env.GEMINI_API_KEY
  apiKey: "AIzaSyAsKhl1OwXCte2dS-6ExyNNNht9_vRtwe4",
});
console.log("gemini key: ", process.env.GEMINI_API_KEY);

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

    const modelName = "gemini-2.5-flash";

    const response = await genAI.models.generateContent({
      model: modelName,
      contents: description,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { type: Type.STRING },
            entities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            roles: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["appName", "entities", "roles", "features"]
        }
      }
    });

    const rawJson = response.text;

    console.log("Gemini structured JSON:", rawJson);

    let parsed;
    try {
      parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
    } catch (e) {
      console.error('❌ Parsing structured JSON failed:', e);
      return res.status(500).json({ error: 'Invalid AI structured response', raw: rawJson });
    }

    console.log("Gemini parsed JSON: ", parsed);

    // const mockExtracted = {
    //   appName: 'Course Manager',
    //   entities: ['Student', 'Course', 'Grade'],
    //   roles: ['Teacher', 'Student', 'Admin'],
    //   features: ['Add course', 'Enrol Students', 'View reports'],
    // };
    const { appName, entities, roles, features } = parsed;
    if (!appName || !Array.isArray(entities) || !Array.isArray(roles) || !Array.isArray(features)) {
      return res.status(500).json({ error: 'AI output missing required fields', raw: parsed });
    }

    const newReq = new Requirement({
      description,
      appName: appName,
      entities: entities,
      roles: roles,
      features: features,
    });
    console.log("💾 Saving requirement:", newReq);

    await newReq.save(); // save to DB

    return res.status(201).json(newReq);
  } catch (err) {
    console.error('❌ Error extracting requirements:', err);
    return res.status(500).json({ error: 'extractRequirements Server error' });
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
