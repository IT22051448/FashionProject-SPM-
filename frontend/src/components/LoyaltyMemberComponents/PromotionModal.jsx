import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const PromotionModal = ({ isOpen, onRequestClose, onPromote }) => {
  const [count, setCount] = useState("");

  const handlePromotion = () => {
    const parsedCount = parseInt(count, 10);
    if (isNaN(parsedCount) || parsedCount <= 0) {
      alert("Please enter a valid number.");
      return;
    }
    onPromote(parsedCount);
    setCount("");
    onRequestClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Promote to Diamond Tier</h2>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Enter number of top customers"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
            />
            <div className="flex gap-2">
              <Button
                onClick={handlePromotion}
                className="bg-purple-500 text-white hover:bg-purple-600"
              >
                Promote
              </Button>
              <Button
                onClick={onRequestClose}
                className="bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionModal;
