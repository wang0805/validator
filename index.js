const express = require("express");
const jsonfile = require("jsonfile");

const app = express();
const file = "sample.json";

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  res.send("testing if works");
});

app.get("/api/v1/validators", (req, res) => {
  jsonfile.readFile(file, (err, obj) => {
    console.log(obj.result.validators);
    res.json(obj);
  });
});

app.post("/api/v1/validators", (req, res) => {
  //x-www-form-urlencoded form
  //with required fields address, pub_key_type, pub_key_value , voting_power, proposer_priority

  jsonfile.readFile(file, (err, obj) => {
    console.log(obj.result.validators);
    let validators = obj.result.validators;
    let duplicates = false; //check if duplicates
    let newObj = {
      address: req.body.address,
      pub_key: {
        type: req.body.pub_key_type,
        value: req.body.pub_key_value
      },
      voting_power: req.body.voting_power,
      proposer_priority: req.body.proposer_priority
    }; // obj for creating new entry if no duplicates
    let index; //index for the duplicate

    for (let i = 0; i < validators.length; i++) {
      if (
        req.body.address === validators[i].address &&
        req.body.pub_key_value === validators[i].pub_key.value
      ) {
        duplicates = true;
        let votingpower =
          parseInt(validators[i].voting_power) +
          parseInt(req.body.voting_power);
        newObj = {
          address: validators[i].address,
          pub_key: {
            type: validators[i].pub_key.type,
            value: validators[i].pub_key.value
          },
          voting_power: votingpower.toString(),
          proposer_priority: validators[i].proposer_priority
        }; //newObj if duplicates and add up the voting power, similar steps can be done to amend block height
        index = [i];
        break;
      }
    }

    if (duplicates === true) {
      obj.result.validators[index] = newObj;
    } else {
      obj.result.validators.push(newObj);
    }
    console.log(obj);
    jsonfile.writeFile(file, obj, err => {
      console.log(err);
      res.json(obj.result.validators);
    });
  });
});

app.get("/api/v1/validators/:address", (req, res) => {
  jsonfile.readFile(file, (err, obj) => {
    let address = req.params.address;
    let validators = obj.result.validators;
    let addObj = {};

    for (let i = 0; i < validators.length; i++) {
      if (address === validators[i].address) {
        addObj = validators[i];
        break;
      }
    }
    res.json(addObj);
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
