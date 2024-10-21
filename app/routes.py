import json

from flask import Flask, jsonify, render_template

# Load datas from JSON file (RACES, CLASSES, SUBCLASSES, etc)
with open("data/classes.json") as f:
    classes = json.load(f)

with open("data/races.json") as f:
    races = json.load(f)


def create_app():
    app = Flask(__name__)

# ---- PATH TO THE MAIN PAGES ----
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

# ---- PATH TO THE JSON DATA PAGES ----
    @app.route("/get_classes")
    def get_data():
        return jsonify(classes)

    @app.route("/get_races")
    def get_races():
        return jsonify(races)

    return app
