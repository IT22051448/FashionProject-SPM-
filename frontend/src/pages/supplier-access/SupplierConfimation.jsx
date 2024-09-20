import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateToken } from "@/redux/supplierToken/supplierTokenSlice";

const SupplierConfirmation = () => {
  const { tokenId } = useParams(); // Get the token from the URL
  const dispatch = useDispatch();
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await dispatch(validateToken(tokenId)).unwrap();
        setTokenData(result.data); // Store the entire token object
      } catch (err) {
        setError("Invalid token. Access denied.");
      }
    };

    checkToken();
  }, [tokenId, dispatch]);

  return (
    <div>
      <h1>Please Confirm your Supply</h1>
      {error && <p>{error}</p>}
      {tokenData ? (
        <div>
          <h3>Additional Information:</h3>
          <ul>
            <li>
              <strong>Item Code:</strong> {tokenData.itemId} {/* Item code */}
            </li>
            <li>
              <strong>Quantity:</strong> {tokenData.quantity}
            </li>
            <li>
              <strong>Date:</strong> {new Date(tokenData.date).toLocaleString()}
            </li>
          </ul>
        </div>
      ) : (
        <p>Validating token...</p>
      )}
    </div>
  );
};

export default SupplierConfirmation;
