# 0003 Identity and site come from the server only
Status: accepted
Why: the web app and MCP tools are clients and can be manipulated.
Consequence: site, user and role are taken from res.locals.user, never from the request body or query.
