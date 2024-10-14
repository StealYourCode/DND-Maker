import json

from flask import Flask, jsonify, render_template

# Load data from JSON file
with open("data/classes.json") as f:
    data = json.load(f)

with open("data/races.json") as f:
    races = json.load(f)


def create_app():
    app = Flask(__name__)

    # Path to the home page(/) html code
    @app.route("/")
    def index():
        return render_template("index.html")

    # Path to the new character creation page
    @app.route("/create")
    def newCharacter():
        return render_template("newCharacter.html")

    @app.route("/loaded")
    def loadCharacter():
        return render_template("loadCharacter.html")

    @app.route("/get_data")
    def get_data():
        return jsonify(data)

    @app.route("/get_races")
    def get_races():
        return jsonify(races)

    return app
