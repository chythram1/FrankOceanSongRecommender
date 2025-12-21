# Frank Ocean Song Recommender 🌊

A dreamy, ML-powered song recommender that uses **TextBlob sentiment analysis** to match your emotions to the perfect Frank Ocean track. As a huge Frank Ocean fan, what other better way is there to practice machine learning! :)

## Lessons Learned:
Sentiment analysis works by detecting the meaning and emotional weight of words. However, in music, lyrics alone are not always an indicator of how a song makes us feel.
For example, "Self Control" by Frank Ocean has lyrics like:
"poolside convos about your summer last night"
"our time was right"
At first glance, the model assigned this a more positive score (closer to 1.0) because the words seem pleasant and nostalgic. However, I would say that it is one of his saddest tracks due to the melancholy from the music itself, the way Frank sings it, and the emotional context behind the words.
With that being said, some of the results from this recommender aren't ones I necessarily agree with, but that's part of what made this project interesting! A truly accurate music-mood matcher would need audio analysis (like Spotify's actual valence scores) combined with lyrical sentiment, which is what makes recommendation systems so complex! Overall, I learned a lot and hope to continue to improve it!
## TODO
- Validate all the results
## ✨ Features

- **ML Sentiment Analysis** - Uses TextBlob's Naive Bayes classifier to analyze emotions
- **Blurred Frank Ocean Background** - Dreamy portrait with color-changing auras
- **Valence Matching** - Maps sentiment polarity to song "valence" (musical energy)
- **Album Art Display** - Shows album covers with mood-matched aura effects
- **Spotify Integration** - Direct link to play songs

## 🧠 How the ML Works

1. **Input**: User types how they're feeling
2. **TextBlob Analysis**: Analyzes text using a pre-trained Naive Bayes classifier
   - Returns `polarity` (-1 to 1) and `subjectivity` (0 to 1)
3. **Valence Mapping**: Converts polarity to valence scale (0 to 1)
4. **Song Matching**: Finds Frank Ocean song with closest valence score
5. **Result**: Displays song with mood-matched color aura

## 🚀 Quick Start

### Frontend Only (No ML)
```bash
cd frank-ocean-app
npm install
npm run dev
```
Uses client-side keyword matching as fallback.

### Full Stack with ML Backend
```bash
# Terminal 1: Start Python backend
cd backend
pip install -r requirements.txt
python -m textblob.download_corpora  # Download ML models
python app.py

# Terminal 2: Start React frontend
cd ..
npm install
npm run dev
```

## 📁 Project Structure

```
frank-ocean-app/
├── backend/
│   ├── app.py           # Flask API with TextBlob ML
│   ├── data.py          # Song library with valence scores
│   └── requirements.txt # Python dependencies
├── public/
│   ├── frank-ocean.png  # Background image
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## 🔌 API Endpoints

### `POST /api/recommend`
Get a song recommendation based on emotion text.

**Request:**
```json
{
  "feeling": "I'm feeling nostalgic and a bit heartbroken"
}
```

**Response:**
```json
{
  "title": "Self Control",
  "album": "Blonde",
  "spotify_url": "https://open.spotify.com/track/...",
  "cover": "...",
  "mood_score": 0.22,
  "sentiment": {
    "polarity": -0.56,
    "subjectivity": 0.8
  },
  "song_valence": 0.22
}
```

### `POST /api/analyze`
Analyze sentiment without song matching (for debugging).

### `GET /api/songs`
Get all songs with their valence scores.

### `GET /api/health`
Health check endpoint.

## 🚀 Deploy to Vercel

### Frontend Only
```bash
cd frank-ocean-app
vercel
```

### With Backend (use separate services)

**Frontend on Vercel:**
1. Deploy frontend to Vercel
2. Set environment variable: `VITE_API_URL=https://your-backend.com`

**Backend options:**
- [Railway](https://railway.app) - Easy Python hosting
- [Render](https://render.com) - Free tier available
- [Fly.io](https://fly.io) - Global edge deployment

## 🎨 Mood → Color Mapping

| Valence | Colors | Example Songs |
|---------|--------|---------------|
| 0.0-0.25 | Cool blues/purples | Seigfried, Bad Religion |
| 0.25-0.5 | Deep reds/pinks | Self Control, Ivy |
| 0.5-0.75 | Warm oranges | Nights, Pyramids |
| 0.75-1.0 | Soft pastels | Sweet Life, Forrest Gump |

## 🎵 Song Library

35+ songs across:
- **Blonde** (2016) - 13 tracks
- **Channel Orange** (2012) - 11 tracks
- **Nostalgia, Ultra** (2011) - 5 tracks
- **Singles** - 8 tracks

Each song has a manually-assigned valence score based on musical and lyrical analysis.

