const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
mongoose.connect('mongodb://localhost:27017/tshirtsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const shirtsSchema = new mongoose.Schema({
  tshirt: String,
  size: String,
  price: Number,
});
const Tshirt = mongoose.model('Tshirt', shirtsSchema);

/** *************************HTTP request verbs for the main route***************************************** */
app.get('/tshirts', (req, res) => {
  Tshirt.find((err, findItems) => {
    if (findItems) {
      res.send({
        success: true,
        data: findItems,
      });
    } else {
      res.send('error');
    }
  });
});

app.post('/tshirts', (req, res) => {
  const newTshirt = new Tshirt({
    tshirt: req.body.tshirt,
    size: req.body.size,
    price: req.body.price,
  });
  newTshirt.save((err) => {
    if (err) {
      res.send('error');
    } else {
      res.send({
        success: true,
        data: newTshirt,
      });
    }
  });
});

/** **********************************HTTP request verbs for a specific route******************************************** */
app.get('/tshirts/:shirtId', (req, res) => {
  const { shirtId } = req.params;
  Tshirt.findOne({
    _id: shirtId,
  }, (err, findItem) => {
    if (findItem) {
      res.send({
        success: true,
        data: findItem,
      });
    } else {
      res.send('error');
    }
  });
});

// app.put("/tshirts/:shirtId", function(req, res) {
//   Tshirt.update({
//       _id: req.params.shirtId
//     }, {
//       tshirt: req.body.tshirt,
//       size: req.body.size,
//       price:req.body.price
//     }, {
//       overwrite: true
//     },
//     function(err) {
//       if (!err) {
//         res.send("Successfully updated the entire document");
//       } else {
//         res.send("error");
//       }

//     });
// });

app.patch('/tshirts/:shirtId', (req, res) => {
  const { shirtId } = req.params;
  Tshirt.findByIdAndUpdate({
    _id: shirtId,
  }, {
    $set: req.body,
  },
  { new: true },
  (err, result) => {
    if (!err) {
      res.send({
        success: true,
        data: result,
      });
    } else {
      res.send('error');
    }
  });
});

app.delete('/tshirts/:shirtId', (req, res) => {
  const { shirtId } = req.params;
  Tshirt.deleteOne({
    _id: shirtId,
  },
  (err) => {
    if (!err) {
      res.send({
        success: true,
        message: `${'removed a tshirt with id:' + ' '}${shirtId}`,
      });
    } else {
      res.send('error');
    }
  });
});

app.listen('3000', () => {
  console.log('server is running on port number 3000');
});
