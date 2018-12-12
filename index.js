const express = require('express');
const app = express();
const Block = require('./block');
const bodyParser = require('body-parser');
const Blockchain = require('./simpleChain');
const newChain = new Blockchain();
const PORT = 8000;


app.listen(PORT, () => console.log('Listening on port'+ PORT));
app.use(bodyParser.json());
app.get('/', (req, res) => res.status(404).json({
  "status": 404,
  "message": "Accepted endpoints for this project: POST /block or get /block/{BLOCK_HEIGHT}"
  + "Follow this example to get the genesis block from Blockchain - http://localhost:8000/block/0"
}) );

app.get('/block/:height', async (req, res) =>{
  try{
    const response = await newChain.getBlock(req.params.height);
    res.send(response);
  }catch(error){
      res.status(404).json({
    "status": 404,
    "message": " The Block "+  req.params.height +" not found"
  });
  }
});

app.post('/block', async(req, res) => {
    try{
    if (req.body.body === '' || req.body.body === undefined){
      res.status(400).json({
        "status": 400,
        message : "Fill the body parameter"
      });
    }

    await newChain.addBlock(new Block(req.body.body));
    const height = await newChain.getBlockHeight();
    const response = await newChain.getBlock(height);

    res.status(201).send(response);
  }catch(error){
    res.status(404).json({
      "status": 404,
      "message": "Error during addBlock function. Error message"+ error +" Try it again"
    });
  }

});
