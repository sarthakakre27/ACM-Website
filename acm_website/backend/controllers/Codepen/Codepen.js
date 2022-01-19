
const project = require('../../models/projectModel');

const getProject = (req, res) => {
    project.findOne({
      _id: req.params.id
    }, (err, data) => {
      if (err) throw err;
      if(req.currentUserName === data.owner) {
        res.send(data);
      }
      else {
        res.sendStatus(403);
      }
    })
  };
  
const getAllProjects = (req, res) => {
    if(req.currentUserName){
      project.find({
        owner: req.currentUserName
      }, (err, data) => {
        if (err) throw err
        res.send(data);
      })
    }else{
      console.log("no");
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
  }
  
const saveProject = (req, res) => {
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
  }
  
 const deleteProject= (req, res) => {
    project.findByIdAndDelete(req.body.id, (err, result) => {
      if (err) throw err;
    })
    res.send({
      message: "Successfully deleted"
    });
  }
  

  module.exports = {
    getProject,
    getAllProjects,
    newProject,
    saveProject,
    deleteProject
    }