import express from 'express';
import { addSupplier,feetchSuppliers } from '../controllers/supplier.controller';

const router = express.Router();

router.post('/add-supplier', addSupplier);
router.get("/get-supplier", feetchSuppliers);


export default router;