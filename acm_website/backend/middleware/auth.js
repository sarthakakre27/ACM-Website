//const config = require('config')

const jwt = require('jsonwebtoken')
const { models } = require('mongoose')

// function auth(req,res,next) {
//     const token = req.header('x-auth-token')

//     // check for token
//     if(!token) res.status(401).json({ msg:'No token:Authorization denied '})

//     try{

//         // Verify token
//         const decoded = jwt.verify(token,config.get('jwtSecret'))

//         // Add user from payload
//         req.user = decoded
//         next();
//     }catch(err) {
//         res.status(400).json({ msg:'token is not valid' })
//     }

// }

// Authentication middleware
const auth = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if(token == null) {
		return res.status(401).send("Unauthorized access");
	}

	// Veify the token of the user
	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
		if(err) {
			console.error(err);
			return res.status(403).send("Session expired");
		}
		req.currentUserName = user.name;
		next();
	})
};

module.exports = auth