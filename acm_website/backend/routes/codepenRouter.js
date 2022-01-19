
const express = require("express");
const router = express.Router();


const {getProject,getAllProjects,newProject,saveProject,deleteProject} = require("../controllers/Codepen/Codepen");
const auth = require("../middleware/auth");

router.get('/getProject/:id', auth, getProject);
router.get('/getAllProjects', auth, getAllProjects);
router.post('/newProject', auth, newProject);
router.post('/saveProject', auth, saveProject);
router.post('/deleteProject', auth, deleteProject);

module.exports = router;