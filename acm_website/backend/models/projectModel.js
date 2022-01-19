const mongoose = require('mongoose');


const projectSchema = {
    html:String,
    css:String,
    js:String,
    name:String,
    owner:String,
  };

const project = mongoose.model("project", projectSchema);

module.exports = project;