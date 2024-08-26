import logger from '../../utils/logger.js';
import User from '../models/user.model.js';
import { validationResult } from 'express-validator';

const userController = {

    
    async getAllUsers(req, res) {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            res.json(user);
        }
        catch (error) {
            logger.error(error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    async updateUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Invalid' });
            }

            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.name = req.body.name;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.password = bcrypt.hashSync(req.body.password, 10);
            user.role = req.body.role;
            user.avatar = req.body.avatar;
            user.contact = req.body.contact;
            user.address = req.body.address;
            user.city = req.body.city;
            user.postalCode = req.body.postalCode;
            user.country = req.body.country;

            await user.save();
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.remove();
            res.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            logger.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export default userController;
