from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
CORS(app)  # Allow frontend access

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Ensure folder exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Save file
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    print(f"✅ Saved: {file.filename} ({os.path.getsize(filepath)} bytes)")

    return jsonify({'message': f'File {file.filename} uploaded successfully'}), 200



@app.route('/all-data', methods=['GET'])
def get_all_data():
    all_data = []

    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if filename.endswith('.csv') or filename.endswith('.xlsx'):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            try:
                if filename.endswith('.csv'):
                    df = pd.read_csv(file_path)
                else:
                    # ✅ Explicitly tell pandas to use openpyxl
                    df = pd.read_excel(file_path, engine='openpyxl')

                all_data.append(df)
            except Exception as e:
                print(f"Error reading {filename}: {e}")

    if all_data:
        merged = pd.concat(all_data, ignore_index=True)
        return merged.to_json(orient='records')
    else:
        return jsonify([])



@app.route('/clear-uploads', methods=['POST'])
def clear_uploads():
    for file in os.listdir(app.config['UPLOAD_FOLDER']):
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file))
    return jsonify({'message': 'Uploads cleared'}), 200

if __name__ == '__main__':
    app.run(debug=True)
