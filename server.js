const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/clip', async (req, res) => {
  const url = req.body.url;
  const apiKey = req.body.apiKey;
  console.log('Received URL:', url);

  const outputFile = 'output.md';
  const clipper = spawn('clipper', ['clip', '-u', url, '-o', outputFile]);

  clipper.stderr.on('data', (data) => {
    console.error('Clipper stderr:', data.toString());
  });

  clipper.on('error', (error) => {
    console.error('Clipper error:', error);
    res.status(500).json({ error: 'An error occurred while running Clipper' });
  });

  clipper.on('close', async (code) => {
    console.log('Clipper process exited with code:', code);
    if (code === 0) {
      const markdownPath = path.join(__dirname, outputFile);
      fs.readFile(markdownPath, 'utf8', async (err, data) => {
        if (err) {
          console.error('Error reading markdown file:', err);
          res.status(500).json({ error: 'An error occurred while reading the markdown file' });
        } else {
          try {
            const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({ input: data }),
            });

            const moderationData = await moderationResponse.json();
            res.json({ markdown: data, moderation: moderationData });
          } catch (error) {
            console.error('Error calling OpenAI moderation API:', error);
            res.status(500).json({ error: 'An error occurred while calling the OpenAI moderation API' });
          }
        }
      });
    } else {
      res.status(500).json({ error: 'Clipper process exited with a non-zero code' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
