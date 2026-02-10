from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def health_check():
    return jsonify({
        "status": "CyberSentinel AI System Operational",
        "version": "1.0.0"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)