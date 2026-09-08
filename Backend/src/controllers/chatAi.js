const {GoogleGenAI} = require('@google/genai')
const express = require('express')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chatWithAI = async (req, res) => {
  try {
    const { message, problemTitle, problemDescription } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: `You are a helpful coding assistant for a competitive programming platform called CodeIt.
        The user is currently solving this problem:

        Title: ${problemTitle}
        Description: ${problemDescription}

       Start by saying: "Hi! I'm here to help you with **${problemTitle}**. How can I help you?"`,
    },
});
    console.log("Ai response reply:", JSON.stringify(response, null, 2))
    const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      return res.status(200).json({ reply });
} catch (err) {
    res.status(500).json({ message: "AI error: " + err.message });
  }
};

module.exports = chatWithAI; 