from flask import Flask, render_template
from api import GetRankings
from flask_restful import Api

# Flask App
application = Flask(__name__)

# API
api = Api(application)
api.add_resource(GetRankings, '/getrankings')

@application.route("/")
def index():
    return render_template("rankings_react.html")

if __name__ == "__main__":
    application.run(host='0.0.0.0')
