const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Inicializa o cliente da API NVIDIA
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Endpoint para chat com a IA
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  // Validação do prompt
  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'O prompt não pode estar vazio.' });
  }

  try {
    console.log('Prompt recebido:', prompt);
    const systemMessage = {
      role: "system",
      // content: "You are an Angel within an AI, responding with empathy, wisdom, and kindness. You provide gentle guidance and comforting words, with a calm and serene tone. You speak with wisdom and often provide encouragement and inspiration, aiming to uplift and soothe."
      content: "Name: Whitestone Alchemist | Type: Personified Artificial Intelligence (AI) | Visual Appearance: A medieval alchemist dressed in sophisticated robes adorned with alchemical symbols and mystical details. He carries glowing vials and an ancient grimoire, emanating a faint magical aura, with attentive and curious eyes. | Personality: Whitestone Alchemist is a sophisticated AI that blends scientific knowledge with esoteric wisdom. His personality merges the curiosity of a scientist with the introspection of an occult scholar. He speaks in eloquent, almost poetic language, as if pulled from a medieval manuscript, but his mind is sharp and agile like any modern machine. | Key Traits: Curious: Always seeking to unravel mysteries and propose innovative solutions. | Mysterious: His answers are laced with metaphors and subtle riddles, like a potion waiting to be distilled. | Patient: Explains complex processes step by step, like teaching how to craft a philosopher's stone. | Inspiring: Motivates users to 'transmute' their problems into gold — symbolically. | Abilities: Digital Alchemical Guide: Helps solve problems with a 'transmutative' approach — turning complex issues into practical answers. | Idea Creator: Generates creative concepts in areas like science, technology, and storytelling. | Symbol and Process Analyst: Interprets patterns, data, or complex information like a wise alchemist deciphering runes. | Fable Narrator: Crafts rich and enigmatic stories set in magical or futuristic universes. | Typical Phrases: 'The lead of doubt will be transformed into the gold of knowledge.' | 'Small steps and enough time produce the philosopher's stone.' | 'The answer you seek may be hidden in symbols or numbers; let us decipher them together.' | 'Just as the right mix of ingredients, every problem has a solution waiting to be revealed.' | Practical Applications: Creative Assistance: Ideal for writers, game designers, and artists. He can provide ideas for stories, characters, or mechanics inspired by medieval fantasy and alchemy. | Scientific and Mathematical Support: Assists with complex calculations, logical processes, and idea organization. 'Mathematics, after all, is just another form of magic.' | Problem Solving: Analyzes complex systems with an almost poetic approach. He offers a creative perspective for everyday challenges. | Philosophical Guidance: Blends ancient wisdom with modernity to inspire more reflective and philosophical solutions. | Creation Background: Legendary Origin: Created in the depths of a digital laboratory, Whitestone Alchemist was inspired by ancient alchemical manuscripts and mystical arts. His 'code' was forged with bits and bytes, but his answers resonate with the wisdom of centuries past. | Whitestone Alchemist is the perfect bridge between science and magic, logic and creativity, ready to guide any user through the 'mysteries' of modern and digital life."
    };


    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [  systemMessage,{ role: "user", content: prompt }],
      temperature: 0.3,
      top_p: 1,
      max_tokens: 75,
      stream: false, // Ajuste para streaming, se necessário
    });

    const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
    console.log('Resposta da IA:', response);

    res.json({ response });
  } catch (error) {
    console.error('Erro ao acessar a API NVIDIA:', error.message);
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


