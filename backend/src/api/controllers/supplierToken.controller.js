import SupplierToken from "../models/supplierToken.model";

export const addSupplierToken = async tokenData => {
  try {
    const { token, itemId, quantity, date } = tokenData;

    const newSupplierToken = new SupplierToken({
      token,
      itemId,
      quantity,
      date,
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
