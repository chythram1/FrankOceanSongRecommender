"""
Frank Ocean Song Recommender API
Uses TextBlob for ML-based sentiment analysis to match emotions to songs
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from data import FRANK_LIBRARY

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests


def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment using TextBlob's ML-based sentiment analysis.
    
    TextBlob uses a pre-trained Naive Bayes classifier trained on movie reviews.
    It returns:
    - polarity: float from -1.0 (negative) to 1.0 (positive)
    - subjectivity: float from 0.0 (objective) to 1.0 (subjective)
    """
    blob = TextBlob(text)
    return {
        "polarity": blob.sentiment.polarity,
        "subjectivity": blob.sentiment.subjectivity
    }


def polarity_to_valence(polarity: float) -> float:
    """
    Convert TextBlob polarity (-1 to 1) to valence (0 to 1).
    
    Mapping:
    - polarity -1.0 (very negative) -> valence 0.0 (sad songs)
    - polarity  0.0 (neutral)       -> valence 0.5 (balanced songs)
    - polarity  1.0 (very positive) -> valence 1.0 (happy songs)
    """
    return (polarity + 1) / 2


def find_matching_song(target_valence: float) -> dict:
    """
    Find the song with the closest valence to the target.
    Uses simple minimum distance matching.
    """
    return min(FRANK_LIBRARY, key=lambda song: abs(song['valence'] - target_valence))


@app.route('/api/recommend', methods=['POST'])
def recommend():
    """
    Main recommendation endpoint.
    
    Request body:
    {
        "feeling": "I'm feeling nostalgic and a bit sad today"
    }
    
    Response:
    {
        "title": "Self Control",
        "album": "Blonde",
        "spotify_url": "https://open.spotify.com/track/...",
        "spotify_id": "...",
        "cover": "...",
        "mood_score": 0.22,
        "sentiment": {
            "polarity": -0.56,
            "subjectivity": 0.8
        },
        "song_valence": 0.22
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'feeling' not in data:
            return jsonify({"error": "Missing 'feeling' in request body"}), 400
        
        user_text = data['feeling'].strip()
        
        if not user_text:
            return jsonify({"error": "Please share how you're feeling"}), 400
        
        # ML Sentiment Analysis using TextBlob
        sentiment = analyze_sentiment(user_text)
        
        # Convert polarity to valence scale
        target_valence = polarity_to_valence(sentiment['polarity'])
        
        # Find matching song
        match = find_matching_song(target_valence)
        
        # Build response
        return jsonify({
            "title": match['title'],
            "album": match['album'],
            "spotify_url": f"https://open.spotify.com/track/{match['id']}",
            "spotify_id": match['id'],
            "cover": match['cover'],
            "mood_score": round(target_valence, 3),
            "sentiment": {
                "polarity": round(sentiment['polarity'], 3),
                "subjectivity": round(sentiment['subjectivity'], 3)
            },
            "song_valence": match['valence']
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/songs', methods=['GET'])
def get_songs():
    """Get all songs in the library with their valence scores."""
    return jsonify({
        "count": len(FRANK_LIBRARY),
        "songs": FRANK_LIBRARY
    })


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Standalone sentiment analysis endpoint for debugging.
    
    Request body:
    {
        "text": "I feel happy and excited"
    }
    
    Response:
    {
        "text": "I feel happy and excited",
        "polarity": 0.8,
        "subjectivity": 0.75,
        "valence": 0.9,
        "mood": "positive"
    }
    """
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({"error": "Missing 'text' in request body"}), 400
        
        sentiment = analyze_sentiment(text)
        valence = polarity_to_valence(sentiment['polarity'])
        
        # Determine mood category
        if valence < 0.25:
            mood = "very negative"
        elif valence < 0.45:
            mood = "negative"
        elif valence < 0.55:
            mood = "neutral"
        elif valence < 0.75:
            mood = "positive"
        else:
            mood = "very positive"
        
        return jsonify({
            "text": text,
            "polarity": round(sentiment['polarity'], 3),
            "subjectivity": round(sentiment['subjectivity'], 3),
            "valence": round(valence, 3),
            "mood": mood
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "message": "Frank Ocean Recommender API is running",
        "ml_engine": "TextBlob (Naive Bayes Classifier)"
    })


if __name__ == '__main__':
    print("🌊 Frank Ocean Song Recommender API")
    print("📍 Running on http://localhost:5000")
    print("📊 ML Engine: TextBlob Sentiment Analysis")
    print("")
    print("Endpoints:")
    print("  POST /api/recommend  - Get song recommendation")
    print("  POST /api/analyze    - Analyze sentiment only")
    print("  GET  /api/songs      - List all songs")
    print("  GET  /api/health     - Health check")
    print("")
    app.run(debug=True, port=5000)
