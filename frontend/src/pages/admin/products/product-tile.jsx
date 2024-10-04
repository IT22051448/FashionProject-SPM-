/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const AdminProductTile = ({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) => {
  

  return (
    <Card className="w-full max-w-sm mx-auto ">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[300px] object-cover rounded-t-1 "
        />
      </div>
      <CardContent>
        <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
        <div className="flex justify-between">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through" : ""
            } text-lg font-semibold text-primary`}
          >
            ${product?.price}
          </span>
          <span className="text-lg font-bold">${product?.salePrice}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}>Edit</Button>
        <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default AdminProductTile;
