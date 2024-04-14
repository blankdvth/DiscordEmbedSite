# Discord Embed Site
This is a simple site that allows regular users to send Discord embeds without the use of a webhook or bot.

## Implementation
OpenGraph meta tags are dynamically generated based on the slug of the URL, which is an LZString compressed JSON
string of all the embed data. The main page of the site is a form that allows users to enter the embed data and
generate the proper URL.

## Limitations
This makes use of OG meta tags to provide embed data, it does not support some of the more advanced embed features
in Discord that can only be done using webhooks or bots (such as fields, footers, etc). It also (unfortunately) does
not support markup of any form -- whether it be Markdown or HTML. It appears that Discord does not render markup
for embeds that are not sent by a webhook or bot.

While in theory this abides by Discord's Terms of Service, using it is at your own risk. I am not responsible for
any action taken against your account for using this site. There is also no guarantee made as to the longevity or
availability of this site. Luckily, embeds are cached by Discord, so even if this site goes down, your embeds will
still be available, except the redirect.

## Usage
<details>
<summary>Samples</summary>

![Sample Embed - Small Image](https://s3.blankdvth.com/8fa2a452-cc1f-4ff1-92b5-e1c9d725b70d.png)  
![Sample Embed - Large Image](https://s3.blankdvth.com/fa4123ef-e9c6-44db-8158-dd49900059ce.png)  
![Sample Embed - Video](https://s3.blankdvth.com/bed3827c-70ac-4d03-b46e-bcfe87e3e542.png)  
![Sample Embed - Video Thumbnail](https://s3.blankdvth.com/bff0b037-0050-47c7-bb15-cf12dd4493e5.png)

</details>

### Website
Embeds can be created using a simple form on the site. Here is a breakdown of the fields:

- **Title** - The title of the embed. This will be automatically hyperlinked to the (embed) website URL that was generated.
- **Author** - The text for the author (provider) field of the embed.
- **Description** - The description of the embed.
- **Colour** - The colour of the embed sidebar. You can either use the colour picker or enter a 6-digit hex code.
- **Media** - This can either be an image or a video.
  - **Image** - The direct URL of the image to use, this means it must go directly to the image, not a webpage. This can generally be found by right-clicking an image and selecting "Copy Image Address" or "Copy Image Location".
    - By default, this will be a small image in the top-right corner of the embed. You can check the "Large Image" box to make it a large image at the bottom of the embed.
  - **Video** - The direct URL of the video to use, this means it must go directly to the video. Only videos of type MP4, WebM, or MOV are supported.
    - You can also optionally enter a thumbnail image URL to use for the video. This will replace the default video thumbnail (which is usually the first frame of the video).
    - The description of the embed is not shown when a video is used.
- **Redirect URL** - The URL to redirect to if the embed website URL is clicked. A redirect warning will be displayed.

### Programmatically
You can also programmatically create embed URLs by yourself, entirely locally. Currently, there is no API endpoint
to generate this as it is extremely simple to do yourself. Here is a breakdown of the steps:

1. Create a dictionary of your data. See [here](#json-fields) for a list of fields.
2. Convert the dictionary to a JSON string.
3. Compress the JSON string to a URI Encoded Component string using LZString.
4. Append the compressed string to the end of the URL `https://embed.blankdvth.com/`.

#### JSON Fields
These keys for these fields are from the HTML form's ID attributes, with \- replaced with \_. 

- `title` - The title of the embed. This will be automatically hyperlinked to the (embed) website URL that was generated.
- `author` - The text for the author (provider) field of the embed.
- `description` - The description of the embed. Will not be shown if embed media is a video.
- `colour` - The colour of the embed sidebar. Must be a 6-digit hex code (including the #).
- `media_type` - What the media URL is. Must be either `Image` or `Video` (case-sensitive).
- `media` - The media URL, must be a direct link to the image or video. If video, must be `MP4`, `WebM`, or `MOV`.
- `large_image` - Whether the image should be large. Only applies when `media_type` is `Image`.
- `thumbnail` - The thumbnail image direct URL to use for the video. Only applies when `media_type` is `Video`.
- `redirect` - The URL to redirect to if the embed website URL is clicked. A redirect warning will be displayed.

##### Not Used
- `colour-hex` - Internal use only, use `colour` instead.
- `liability` - Not checked server-side, is only used during form validation. Set to `True` if you want to be really safe.

#### Example Code
The LZString module is available in many languages, see a list [here](https://www.npmjs.com/package/lz-string#other-languages).

```python
# This uses the LZString Python library -- https://pypi.org/project/lzstring/
from json import dumps
from lzstring import LZString

# Define the data you want to use
data = {
    "title": "Hello World",
    "description": "This is a test embed."
}

# Dump the dict to a string, compress it, and append it to the domain.
url = f"https://embed.blankdvth.com/{LZString.compressToEncodedURIComponent(dumps(data))}"
```

```javascript
// This assumes you have LZString available and imported as appropriate -- https://www.npmjs.com/package/lz-string

// Define the data you want to use
const data = {
    title: "Hello World",
    description: "This is a test embed."
};

// Convert the dataset to a JSON string, compress it, and append it to the domain.
const url = `https://embed.blankdvth.com/${LZString.compressToEncodedURIComponent(JSON.stringify(data))}`;
```

## Deploying
You may choose to deploy this site yourself. It is recommended to do so using a VPS with WSGI. Alternatively,
you can use a site such as [PythonAnywhere](https://www.pythonanywhere.com/) to host the site for free.

I won't go into detail on how to do this here, but you can find a guide online on how to deploy a Flask app using WSGI.
