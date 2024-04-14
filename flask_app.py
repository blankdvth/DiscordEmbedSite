from json import loads
from json.decoder import JSONDecodeError

from flask import Flask, render_template, abort
from lzstring import LZString

app = Flask(__name__)


def load_data(data) -> dict:
    try:
        return loads(LZString.decompressFromEncodedURIComponent(data))
    except (JSONDecodeError, KeyError, TypeError, UnboundLocalError):
        abort(404)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/<data>')
def show(data: str):
    return render_template("show.html", data=load_data(data), raw_data=data)


# TODO: Add embed preview (basic)
if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)
