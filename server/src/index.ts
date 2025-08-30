import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8787;

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Session token broker for OpenAI Realtime WebRTC
app.get('/api/session-token', async (_req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server missing OPENAI_API_KEY' });
      return;
    }

    const resp = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-realtime',
        voice: 'alloy',
        modalities: ['audio','text'],
        tool_choice: 'auto'
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      res.status(502).json({ error: 'Upstream error', detail: text });
      return;
    }

    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session', detail: (err as Error).message });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});


