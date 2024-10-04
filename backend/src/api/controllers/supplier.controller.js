import Supplier from "../models/supplier.model";

export const addSupplier = async (req, res) => {
  try {
    const {
      supId,
      name,

      address,
      email,
      phone,
    } = req.body;

    const newSuplier = new Supplier({
      supId,
      name,
      address,
      email,
      phone,
    });
    newSuplier.save();
    res.status(200).json({ message: "Supplier added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const feetchSuppliers = async (req, res) => {
  try {

    const suppList = await Supplier.find({});
    res.status(200).json({ stocks: suppList });
    
  } catch (error) {
     console.log(error);
     res.status(500).json({ message: "error in fetching suppliers" });
    
  }
}

