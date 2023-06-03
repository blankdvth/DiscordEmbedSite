from json import loads
from json.decoder import JSONDecodeError

from flask import Flask, render_template, abort
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
    return render_template("show.html", data=load_data(data), raw_data=data)


# TODO: Fill out README
# TODO: Improve descriptions
# TODO: Add error page (at least for 400)
# TODO: Add embed preview (basic)
# TODO: Add deployment script server-side
# TODO: Link hiding symbols (probably not doing it as it'll be abused) - https://www.reddit.com/r/discordapp/comments/lasfun/how_to_hide_discord_invite_link/
if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)
