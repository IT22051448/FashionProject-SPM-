import SupplierToken from "../models/supplierToken.model";

export const addSupplierToken = async (req, res) => {
  try {
    const { token, data } = req.body;

    const newSupplierToken = new SupplierToken({
      token,
      data,
    });

    newSupplierToken.save();
    res.status(200).json({ message: "Supplier token added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const validateToken = async tokenToValidate => {
  try {
    // Find the token in the database
    const foundToken = await SupplierToken.findOne({ token: tokenToValidate });

    if (foundToken) {
      return {
        valid: true,
        data: foundToken.data, // Return associated data
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