import Stock from "../models/stock.model";
import mongoose from "mongoose";
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
        res.status(200).json({ message: "Stock added successfully"}) ;
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        
        
    }


}


export const fetchStock = async (req, res) => {
  try {



    const stocksList = await Stock.find({});
    res.status(200).json({ stocks: stocksList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const fetchLowStocks = async (req, res) => {
  try {
    // Find stocks where totalStock is less than the stock's lowStockThreshold
    const lowStockItems = await Stock.find({
      totalStock: {
        $lt: mongoose.model("Stock").schema.paths.lowStockThreshold
          .defaultValue,
      },
    });

    // Respond with the low stock items
    res.status(200).json({ lowStockItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};




