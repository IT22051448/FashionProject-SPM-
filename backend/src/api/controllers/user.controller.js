import { User } from '../models/user.model.js';
// import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

const userController = {

    // get all users
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // get user by id
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    // update a user
    async updateUser(req, res) {
        try {
            // validate user input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // check if user exists
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // update the user
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = bcrypt.hashSync(req.body.password, 10);
            user.role = req.body.role;
            user.avatar = req.body.avatar;
            user.contact = req.body.contact;
            user.address = req.body.address;
            user.city = req.body.city;
            user.postalCode = req.body.postalCode;
            user.country = req.body.country;

            // save the user
            await user.save();
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // delete a user
    async deleteUser(req, res) {
        try {
            // check if user exists
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // delete the user
            await user.remove();
            res.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default userController;
