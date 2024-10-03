import SupplierToken from "../models/supplierToken.model";


export const addSupplierToken = async tokenData => {
  try {
    const { token, itemId, quantity, date,supplier } = tokenData;

    const newSupplierToken = new SupplierToken({
      token,
      itemId,
      quantity,
      date,
      supplier,
    });

    await newSupplierToken.save();
    return { message: "Supplier token added successfully" };
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};

export const validateToken = async tokenToValidate => {
  try {
    const foundToken = await SupplierToken.findOne({ token: tokenToValidate });

    if (foundToken) {
      return {
        valid: true,
        token: foundToken, 
      };
    } else {
      return {
        valid: false,
        message: "Invalid token.",
      };
    }
  } catch (error) {
    throw new Error("Error validating token: " + error.message);
  }
};


export const fetchStockOrders = async(req,res) =>{
  try {

    const orderList = await SupplierToken.find({}).populate("supplier");
    res.status(200).json({ orders: orderList });
    
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
    
  }
}