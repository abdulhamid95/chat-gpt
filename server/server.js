const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const fetch = require("node-fetch");
const { Configuration, OpenAIApi } = require("openai");
const multer = require("multer");


const upload = multer();



const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});


const openai = new OpenAIApi(configuration);

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT;

// هاد فقط للإكمال التشات


app.post('/completions', async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.message,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    })
    console.log(req.body.message);
    res.status(200).json({ result: response.data.choices[0].text });
  } catch(e) {
    res.send(e)
  }
})

app.post('/chat/completions', async (req, res) => {

    // console.log(req.body);

    // const options = {
    //     method: "POST",
    //     headers: {
    //         "Authorization": `Bearer ${API_KEY}`,
    //         "Content-Type": 'application/json'
    //     },
    //     body: JSON.stringify({
    //         model: 'gpt-3.5-turbo',
    //         messages: [
    //             {
    //                 role: "user",
    //                 content: req.body.message,
    //             }
    //         ]
    //     })
    // }

    try {
        // const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        // const data = await response.json();
        // res.send(data);
        // console.log(data);

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: req.body.message,
          });
          console.log(req.body);
        res.send(completion.data.choices[0]);
    } catch(error) {
        res.send({"message": error})
    }
})

app.post('/totext', upload.any('file'), async (req, res) => {

  console.log(req.files);
    audio_file = req.files[0];
    buffer = audio_file.buffer;
    buffer.name = audio_file.originalname + '.mp3';

    try {
      const response = await openai.createTranscription(
        buffer,
        "whisper-1", 
        undefined, 
        'json', 
        1, 
        'en' 
      )

      res.send(response.data)
    } catch(e) {
      res.send({"message": e})
    }


})


// صورة
// app.get('/images', async (req, res) => {

// const response = await openai.createImage({
//   prompt: "A photo of a white fur monster standing in a purple room",
//   n: 2,
//   size: "1024x1024",
// });

// res.send(response.data);

// })

app.listen(PORT, () => {
    console.log("Your server runing on PORT " + PORT);
    
})