import Stock from "../models/stock.model";


// Add stock
export const addStock = async (req, res) => {
  try {
    const {
      title,
      description,
      itemId,
      price,
      salePrice,
      totalStock,
      supplier,
    } = req.body;

    const newStock = new Stock({
      title,
      description,
      itemId,
      price,
      salePrice,
      totalStock,
      supplier,
    });

    await newStock.save();
    res.status(200).json({ message: "Stock added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchStock = async (req, res) => {
  try {
    const stocksList = await Stock.find({}).populate("supplier");
    res.status(200).json({ stocks: stocksList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch low stocks based on a fixed threshold
export const fetchLowStocks = async (req, res) => {
  try {
    const lowStockThreshold = 50; // Define your threshold here

   
    const lowStockItems = await Stock.find({
      totalStock: {
        $lt: lowStockThreshold,
      },
    }).populate("supplier"); 

    res.status(200).json({ lowStockItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStock = async (req, res) => {

  try {

    const deleteStock = await Stock.findByIdAndDelete(req.params.id);

    if(!deleteStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    else{
      res.status(200).json({ message: "Stock deleted successfully" });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    
  }



}
