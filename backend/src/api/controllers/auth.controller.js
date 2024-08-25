import User from '../models/user.model.js';
import {validationResult} from 'express-validator';
import logger from '../../utils/logger.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const authController = {
        async register(req, res) {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const userNameExists = await User.findOne({ username: req.body.username });
                if (userNameExists) {
                    return res.status(400).json({ message: 'Username already exists' });
                }
    
                const userExists = await User.findOne({ email: req.body.email });
                if (userExists) {
                    return res.status(400).json({ message: 'User already exists' });
                }

                const password = req.body.password;
                bcrypt.hash(password, saltRounds, async function(err, hash) {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                    else {
                        try {
                            const user = new User({
                                username: req.body.username,
                                email: req.body.email,
                                password: hash,
                                role: req.body.role,
                                avatar: req.body.avatar,
                                contact: req.body.contact,
                                address: req.body.address,
                                city: req.body.city,
                                postalCode: req.body.postalCode,
                                country: req.body.country,
                                created_date: new Date(),
                                last_login: new Date()
                            });
                            await user.save();
                            res.json(user);
                        } catch (error) {
                            logger.error(error.message);
                            return res.status(500).json({ message: error.message });
                            
                        }
                    }
                })
                
            } catch (error) {
                res.status(500).json({ message: error.message });
                logger.error(error.message);
            }
        },
    
        // login a user
        
}

export default authController;