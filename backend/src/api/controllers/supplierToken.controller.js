import SupplierToken from "../models/supplierToken.model";

export const addSupplierToken = async (req, res) => {
  try {
    const { token, itemId, quantity, date } = req.body;

    const newSupplierToken = new SupplierToken({
      token,
      itemId,
      quantity,
      date,
    });

    await newSupplierToken.save(); // Await the save operation
    res.status(200).json({ message: "Supplier token added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const validateToken = async tokenToValidate => {
  try {
    const foundToken = await SupplierToken.findOne({ token: tokenToValidate });

    if (foundToken) {
      return {
        valid: true,
        token: foundToken, // Return the entire token object
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
