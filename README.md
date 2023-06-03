# Discord Embed Site
A Flask app that allows you to generate URLs for Discord embeds, which can be sent by anyone (including users) to show
rich embeds. This does NOT support all embed features, rather, only title, description, colour, and an image. The only
way to use other embed features is to use a Discord bot. Markdown is not supported in any field, as Discord 
prevents it from rendering.

While this is designed for Discord, it can be used for any site that supports embeds.

This site does not store any data server-side, all data is stored in the URL. You may want to use a URL shortener if
you're sending a lot of content.
