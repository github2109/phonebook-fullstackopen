const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URL;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    require: true,
  },
  number: {
    type: String,
    minLength: 8,
    require: true,
    validate: {
      validator: (value) => validateFunc(value),
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});
const validateFunc = (number) => {
  const indexOfFirst = number.indexOf("-");
  return (
    (indexOfFirst === 2 || indexOfFirst === 3) &&
    number.indexOf("-", indexOfFirst + 1) === -1
  );
};
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
