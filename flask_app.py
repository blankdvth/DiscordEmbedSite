from json import loads
from json.decoder import JSONDecodeError

from flask import Flask, render_template, jsonify, abort
from lzstring import LZString

app = Flask(__name__)


def load_data(data) -> dict:
    try:
        return loads(LZString.decompressFromEncodedURIComponent(data))
    except (JSONDecodeError, KeyError):
        abort(400)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/<data>')
def show(data: str):
    # TODO: Handle video
    print(load_data(data))
    return render_template("show.html", data=load_data(data), raw_data=data)


@app.route('/oembed/<data>')
def oembed(data: str):
    data = load_data(data)

    oembed_data = {}
    if "title" in data:
        oembed_data["title"] = data["title"]
    if "author" in data:
        oembed_data["author_name"] = data["author"]
    if "author_url" in data:
        oembed_data["author_url"] = data["author_url"]
    if "provider" in data:
        oembed_data["provider_name"] = data["provider"]
    if "provider_url" in data:
        oembed_data["provider_url"] = data["provider_url"]
    if "large_image" in data and data["large_image"] and "description" not in data:
        oembed_data["type"] = "photo"

    return jsonify(oembed_data)


if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)
