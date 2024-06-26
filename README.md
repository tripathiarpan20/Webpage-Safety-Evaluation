# Webpage safety rater

This is a fun and simple project that evaluates the safety rating of a webpage's text content with the usage of `clipper.js` and the free OpenAI moderation API.


## Installation:
```
nvm install 20.10.0
nvm use 20.10.0
npm install express node-fetch
npm install -g @philschmid/clipper

```


## Run:
```
node server.js
# Navigate to `http://localhost:3000`
# Add your OPENAI_API_KEY from https://platform.openai.com/settings/profile?tab=api-keys in the lower-left text box, at the time of writing the OpenAI Moderation API is free of cost
```

![clipper_1](https://github.com/tripathiarpan20/webpage_openai_moderation/assets/42506819/bfb9eba5-253a-4fa1-801a-2eb2d8e2f5a0)



# References

- https://github.com/philschmid/clipper.js
- https://platform.openai.com/docs/api-reference/moderations/create

# Support 

For incentivising similar future projects, consider starring this repo!
