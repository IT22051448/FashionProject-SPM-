import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateToken } from "@/redux/supplierToken/supplierTokenSlice";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const SupplierConfirmation = () => {
  const { tokenId } = useParams();
  const dispatch = useDispatch();
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await dispatch(validateToken(tokenId)).unwrap();
        setTokenData(result.data);
      } catch (err) {
        setError("Invalid token. Access denied.");
      }
    };

    checkToken();
  }, [tokenId, dispatch]);

  const handleAccept = () => {
    // Logic for accepting the supply
    console.log("Supply accepted");
    // Add your acceptance handling here (e.g., make API call)
  };

  const handleDeny = () => {
    // Logic for denying the supply
    console.log("Supply denied");
    // Add your denial handling here (e.g., make API call)
  };

  return (
    <div className="container mx-auto p-4">
      <header className="bg-black text-white py-4 mb-6">
        <h1 className="text-3xl font-bold text-center">
          Supplier Confirmation
        </h1>
      </header>
      <Separator />
      <h1 className="text-2xl font-bold text-center mt-6 mb-4">
        Please Confirm Your Supply
      </h1>
      {error && <p className="text-red-700 text-center">{error}</p>}
      {tokenData ? (
        <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Supply Confirmation
            </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Item Code:</strong>{" "}
                <span className="text-blue-600">{tokenData.itemId}</span>
              </li>
              <li>
                <strong>Quantity:</strong>{" "}
                <span className="text-blue-600">{tokenData.quantity}</span>
              </li>
              <li>
                <strong>Date:</strong>{" "}
                <span className="text-blue-600">
                  {new Date(tokenData.date).toLocaleString()}
                </span>
              </li>
            </ul>
          </CardContent>
          <Separator />
          <CardFooter>
            <p className="text-gray-500">
              Please review the details before proceeding.
            </p>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex justify-center items-center">
          <Spinner />
          <p className="ml-2">Validating token...</p>
        </div>
      )}

      {tokenData && (
        <div className="flex justify-center mt-10 space-x-4">
          <Button onClick={handleAccept} className="w-80 hover:bg-green-700">
            Accept
          </Button>

          <Button
            onClick={handleDeny}
            className="w-80 bg-slate-500 hover:bg-red-700"
          >
            Deny
          </Button>
        </div>
      )}
      <Separator className='mt-9' />
      {tokenData && (
        <p className="text-center text-lg mt-6">
          Thank you for your trust and partnership. We truly value your support.
        </p>
      )}
    </div>
  );
};

export default SupplierConfirmation;
