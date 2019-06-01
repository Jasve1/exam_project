module.exports = (users) => {
    require('dotenv').config()
    let express = require('express');
    let router = express.Router();

    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');

    router.post('/signUp', (req, res) => {

        if (!req.body.username || !req.body.password) {
            let msg = "Username or password missing!";
            console.error(msg);
            res.status(401).json({msg: msg});
            return;
        }

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            let user = new users({
                username: req.body.username,
                hash: hash
            });
            user.save((err, user) => {
                if(err) return console.error(err);
                res.json(user);
            });
        })
    })

    router.post('/authenticate', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        //Error message
        if (!username || !password) {
            let msg = "Username or password missing!";
            console.error(msg);
            res.status(401).json({msg: msg});
            return;
        }

        users.find({}, (err, users) => {
            if(err) return console.error(err);

            const user = users.find((user) => user.username === username);
            if(user){
                bcrypt.compare(password, user.hash, (err, result) => {
                    if(result){
                        const payload = {
                            username: username,
                            admin: false
                        }
                        const userInfo = {
                            _id: user._id,
                            username: user.username
                        }
                        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                        res.json({
                            msg: 'User has been authenticated',
                            token: token,
                            user: userInfo
                        })

                    }else{
                        res.status(401).json({msg: "Wrong password"});
                    }
                });
            }else {
                res.status(404).json({msg: "User not found!"});
            }

        })
    })

    return router;
}