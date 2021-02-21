const bcrypt = require('bcrypt');
const { Parser } = require('node-sql-parser');

class Router {

    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
        this.signUp(app, db);
        this.delete(app, db);
        this.block(app, db);
        this.unblock(app, db);
    }

    login(app, db) {
        let q = `CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            username VARCHAR(255),
            password VARCHAR(255),
            email VARCHAR(255),
            register_date VARCHAR(255),
            login_date VARCHAR(255),
            status VARCHAR(255))`;
        db.query(q, (err, data, fields) => {
            if (err) {
                console.log(err.message);
            }
        });

        app.post('/login', (req, res) => {
            
            let username = req.body.username;
            let password = req.body.password;

            let cols = [username];
            db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
                
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An errors occured, please try again'
                    })
                    return;
                }
                
                if (data && data.length === 1) {

                    if (data[0].status == 'Blocked'){
                        res.json({
                            success: false,
                            msg: 'This user is blocked'
                        })
                    }

                    else {
                        bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {

                            if (verified) {
                                
                                var today = new Date();
                                var dd = String(today.getDate()).padStart(2, '0');
                                var mm = String(today.getMonth() + 1).padStart(2, '0'); 
                                var yyyy = today.getFullYear();
                                var hh = String(today.getHours()).padStart(2,'0');
                                var _mm = String(today.getMinutes()).padStart(2,'0');
                                var ss = String(today.getSeconds()).padStart(2,'0');
    
                                today = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + _mm + ':' + ss;
                                db.query('UPDATE user SET login_date = ? WHERE username = ?', [today, cols])
                                req.session.userID = data[0].id;
                                
                                db.query('SELECT * FROM user', (e, d, f) => {
                                    if (e) {
                                        res.json({
                                            success: false,
                                            msg: 'An errors occured, please try again'
                                        })
                                        return;
                                    }

                                    res.json({
                                        success: true,
                                        data: d,
                                        username: data[0].username
                                    })
                                })
    
                                return;
                            }
    
                            else {
    
                                res.json({
                                    success: false,
                                    msg: 'Invalid password'
                                })
    
                            }
    
                        });
                    }
                }

                else {
                    
                    res.json({
                        success: false,
                        msg: 'User not found, please try again'
                    })
                }

            });

        });
        
    }

    logout(app, db) {

        app.post('/logout', (req, res) => {

            if (req.session.userID) {

                req.session.destroy();
                res.json({
                    success: true
                })

                return true;

            }

            else {

                res.json({
                    success: false
                })

                return false;

            }
        });
    }

    isLoggedIn(app, db) {

        app.post('/isLoggedIn', (req, res) => {

            if (req.session.userID){

                let cols = [req.session.userID];
                db.query('SELECT * FROM user WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                    if (err) {
                        res.json({
                            success: false,
                            msg: 'An errors occured, please try again'
                        })
                        return;
                    }

                    if (data && data.length === 1) {

                        db.query("SELECT * FROM user", (e, d) => {
                            res.json({
                                success: true,
                                username: data[0].username,
                                data: d
                            })
                        })

                        return true;
                    }

                    else {
                        res.json({
                            success: false
                        })
                    }
                });
            }

            else {
                res.json({
                    success: false
                })
            }
        });
    }

    signUp(app, db) {
        
        let q = `CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            username VARCHAR(255),
            password VARCHAR(255),
            email VARCHAR(255),
            register_date VARCHAR(255),
            login_date VARCHAR(255),
            status VARCHAR(255))`;
        db.query(q, (err, data, fields) => {
            if (err) {
                console.log(err.message);
            }
        });

        app.post('/signUp', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;
            password = bcrypt.hashSync(password, 9);

            let cols = [username];
            db.query('SELECT * FROM `user` WHERE username = ? LIMIT 1', cols, (err, data, fields) => {

                if (err) {
                    res.json({
                        success: false,
                        msg: 'An errors occured, please try again'
                    })
                    return;
                }

                if (data && data.length === 1) {

                    res.json({
                        success: false,
                        msg: 'There is another user with this username'
                    })

                    return false;
                }
                
                else {
                    
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
                    var yyyy = today.getFullYear();
                    var hh = String(today.getHours()).padStart(2,'0');
                    var _mm = String(today.getMinutes()).padStart(2,'0');
                    var ss = String(today.getSeconds()).padStart(2,'0');

                    today = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + _mm + ':' + ss;
                    let value = [null, username, password, email, today, today, 'Unblocked'];
                    db.query('INSERT INTO user (`id`, username, password, email, register_date, login_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    value, (err, data, fields) => {

                        if (err) {
                            console.log(err);
                            res.json({
                                success: false,
                                msg: 'An errors occured, please try again'
                            })
                            return;
                        }

                        res.json({
                            success: true,
                            msg: 'Registration success'
                        })
                    })
                }
            });
        })
    }

    delete(app, db) {

        app.post('/delete', (req, res) => {
            var data = req.body.data;
            var username = req.body.username;
            var self = false;

           
            for (let i = 0; i < data.length; i++) {
                let cols = [data[i]];
                if (data[i] === username) self = true;

                db.query("DELETE FROM user WHERE username = ?", cols, (err) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'An errors occured, please try again'
                        })

                        return;
                    }
                })
            }

            if (self === true) req.session.destroy();
            
            db.query("SELECT * FROM user", (e, d) => {
                res.json({
                    success: true,
                    username: data[0].username,
                    selfKill: self,
                    data: d
                })
            })
        })
    }

    block(app, db) {

        app.post('/block', (req, res) => {
            var data = req.body.data;
            var username = req.body.username;
            var self = false;

            for (let i = 0; i < data.length; i++) {
                let cols = [data[i]];
                if (data[i] === username) self = true;

                db.query("UPDATE user SET status = 'Blocked' WHERE username = ?", cols, (err) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'An errors occured, please try again'
                        })

                        return;
                    }
                })
            }

            if (self === true) req.session.destroy();
            
            db.query("SELECT * FROM user", (e, d) => {
                res.json({
                    success: true,
                    selfKill: self,
                    data: d
                })
            })
        })
    }

    unblock(app, db) {

        app.post('/unblock', (req, res) => {
            var data = req.body.data;

            for (let i = 0; i < data.length; i++) {
                let cols = [data[i]];

                db.query("UPDATE user SET status = 'Unblocked' WHERE username = ?", cols, (err) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'An errors occured, please try again'
                        })

                        return;
                    }
                })
            }
            
            db.query("SELECT * FROM user", (e, d) => {
                res.json({
                    success: true,
                    data: d
                })
            })
        })
    }
}

module.exports = Router;