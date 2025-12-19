import express from "express";
import "dotenv/config";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

//addvanced logger
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teasData = [];
let teaIndex = 1;

app.get("/teas", (req, res) => {
  console.log("Post");

  if (!teasData || teasData.length == 0) {
    return res.status(400).send("404 Data not found");
  }

  res.status(200).send(teasData);
});

app.post("/teas", (req, res) => {
  const { teaname, price } = req.body;
  const newTea = { id: teaIndex++, teaname, price };
  teasData.push(newTea);

  res.status(201).send(newTea);
});

app.put("/teas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { newteaname, newprice } = req.body;

  let tea = teasData.find((t) => t.id === id);

  tea.teaname = newteaname;
  tea.price = newprice;

  if (!tea) {
    return res.status(400).send("404 Data not found");
  }

  res
    .status(200)
    .send({ message: `Tea data updated on ID: ${id}`, teasData: tea });
});

app.delete("/teas/:id", (req, res) => {
  const id = parseInt(req.params.id);

  let ind = teasData.findIndex((t) => t.id === id);

  if (ind === -1) {
    return res.status(400).send("404 Data not found");
  }
  teasData.splice(ind, 1);

  res.status(200).send({ message: `Tea data delated on ID: ${id}` });
});

app.listen(port, () => {
  console.log(`server is listning on port: ${port}`);
});
