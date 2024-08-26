
const orderController = {

    async getOrders(req, res) {
        try {
            if (req.user.role === 'admin') {
                 res.status(200).json({ message: 'Admin can view all orders' });
            } else if (req.user.role === 'user') {
                res.status(200).json({ message: 'User can view their orders' });
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default orderController;