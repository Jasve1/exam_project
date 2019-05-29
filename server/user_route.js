module.exports = (users) => {
    let express = require('express');
    let router = express.Router();

    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');

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
                        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                        res.json({
                            msg: 'User has been authenticated',
                            token: token
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