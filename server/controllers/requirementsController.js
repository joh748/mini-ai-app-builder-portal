// server/controllers/requirementsController.js
export const extractRequirements = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);
    const { description } = req.body;

    if (!description) {
      console.log("❌ No description received");
      return res.status(400).json({ error: 'Description is required' });
    }

    // @todo: connect to gemini API, request and get response, may need parsing the response
    const mockExtracted = {
      appName: 'Course Manager',
      entities: ['Student', 'Course', 'Grade'],
      roles: ['Teacher', 'Student', 'Admin'],
      features: ['Add course', 'Enrol Students', 'View reports'],
    };

    // @todo: save the Gemini response to mongoDB
    console.log("💾 Saving requirement:", mockExtracted);

    } catch (err) {
    console.error('❌ Error extracting requirements:', err);
    res.status(500).json({ error: 'extractRequirements Server error' });
  }
};

export const listRequirements = async (req, res) => {
  try {
    // @todo: get data from MongoDB
    const mockListed = {
      appName: 'Course Manager',
      entities: ['Student', 'Course', 'Grade'],
      roles: ['Teacher', 'Student', 'Admin'],
      features: ['Add course', 'Enrol Students', 'View reports'],
    };
    res.json(mockListed);
  } catch (err) {
    console.error('❌ Error listing requirements:', err);
    res.status(500).json({ error: 'listRequirements Server error' });
  }
};
