import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

//to be able to use the dotenv variables
dotenv.config();

const configuration = new Configuration({
  apiKey : process.env.OPENAI_API_KEY,
});

//create an instance of openai
const openai = new OpenAIApi(configuration);

//initialize express app
const app = express();
//to make cross origin requests and allow server to be called from FE
app.use(cors());
//to pass json from FE to BE
app.use(express.json());

//create a dummy root route
app.get('/', async (req, res) => {
  res.status(200).send({
    message : 'Salaam from CodeX',
  })
})

//the post route allows us to get a 'body' from the FE (it can fetch more data)
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
})

//to ensure server is always running
app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));