import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import logger from "../../utils/logger";

// auth middleware
const authMiddleware =  (roles) => {
    return async (req, res, next) => {

        const { authorization } = req.headers;
    
        if (!authorization) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        const token = authorization.split(' ')[1];
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const _id = decoded._id;
    
            const role = decoded.role;
    
            if (!roles.includes(role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
    
            const user = await User.findOne({ _id });
            req.user = user;
            next();
        } catch(error) {
            logger.error(error.message);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
} 

export default authMiddleware;