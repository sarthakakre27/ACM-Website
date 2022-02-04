
const project = require('../../models/projectModel');
//error handling + async functions needed.

const getProject = (req, res) => {
  try {
    project.findOne({
      _id: req.params.id
    }, (err, data) => {
      if (err) throw err;
      if (req.currentUserName === data.owner) {
        res.send(data);
      }
      else {
        res.sendStatus(403);
      }
    })
  } catch (err) {
    console.log("could not find project");
    console.log(err);
    res.sendStatus(404);
  }
};

const getAllProjects = (req, res) => {
  try {
    if (req.currentUserName) {
      project.find({
        owner: req.currentUserName
      }, (err, data) => {
        if (err) throw err
        res.send(data);
      })
    } else {
      console.log("no user set");
      res.sendStatus(403);
    }
  } catch (err) {
    console.log("could not get all projects");
    console.log(err);
    res.sendStatus(403);
  }
};

//   app.post('/api/userValidation', verifyToken, (req, res) => {
//     const userName = req.user.data.id;

//     if (req.user.data.id) {
//       const token = generateToken({
//         id: userName
//       });
//       res.send({
//         token: token,
//         username: userName
//       });
//     }
//   })

const newProject = (req, res) => {
  const username = req.currentUserName;
  const name = req.body.name;
  try {
    const newProject = new project({
      html: "",
      css: "",
      js: "",
      name: name,
      owner: username,
    });
    newProject.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.send({
          name: name,
          id: newProject._id
        });
      }
    });
  } catch (err) {
    console.log("could not create new project");
    console.log(err);
    res.sendStatus(500);
  }
}

const saveProject = (req, res) => {
  try {
    project.findByIdAndUpdate(req.body.id, {
      html: req.body.html,
      css: req.body.css,
      js: req.body.js
    }, (err, result) => {
      if (err) throw err;
    })
    res.send({
      message: "Successfully saved"
    });
  } catch (err) {
    console.log("could not save project");
    console.log(err);
    res.sendStatus(500);
  }
}

const deleteProject = (req, res) => {
  try {
    project.findByIdAndDelete(req.body.id, (err, result) => {
      if (err) throw err;
    })
    res.send({
      message: "Successfully deleted"
    });
  } catch (err) {
    console.log("could not delete project");
    console.log(err);
    res.sendStatus(500);
  }
}


module.exports = {
  getProject,
  getAllProjects,
  newProject,
  saveProject,
  deleteProject
}