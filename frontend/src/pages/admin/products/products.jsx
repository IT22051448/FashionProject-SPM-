import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "./image-upload";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, addProduct, deleteProduct, updateProduct } from "@/redux/productSlice";
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "./product-tile";

// Import jsPDF and html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    const formDataWithImage = {
      ...formData,
      image: uploadImageUrl || formData.image, // Use the new image or retain the existing one
    };

    currentEditedId !== null
      ? dispatch(
          updateProduct({
            id: currentEditedId,
            formData: formDataWithImage,  // Ensure image is part of the update
            
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(getProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addProduct({
            ...formData,
            image: uploadImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(getProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }


  async function generateReport() {
    if (products && products.length > 0) {
      const doc = new jsPDF();
  
      // Set title - bold and centered
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Products Report", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
  
      // Table headers - bold and centered
      let yPosition = 30;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
  
      const columnPositions = {
        title: 10,
        category: 50,
        brand: 70,
        price: 90,
        salePrice: 110,
        totalStock: 130,
        image: 150,
      };
  
      doc.text("Title", columnPositions.title, yPosition, { align: "center" });
      doc.text("Category", columnPositions.category, yPosition, { align: "center" });
      doc.text("Brand", columnPositions.brand, yPosition, { align: "center" });
      doc.text("Price", columnPositions.price, yPosition, { align: "center" });
      doc.text("Sale Price", columnPositions.salePrice, yPosition, { align: "center" });
      doc.text("Stock", columnPositions.totalStock, yPosition, { align: "center" });
      doc.text("Image", columnPositions.image, yPosition, { align: "left" });
  
      yPosition += 10;
      doc.setFont("helvetica", "normal");
  
      // Loop through each product to add it to the PDF
      for (const product of products) {
        doc.text(product.title, columnPositions.title, yPosition, { align: "center" });
        doc.text(product.category, columnPositions.category, yPosition, { align: "center" });
        doc.text(product.brand, columnPositions.brand, yPosition, { align: "center" });
        doc.text(`$${product.price}`, columnPositions.price, yPosition, { align: "center" });
        doc.text(`$${product.salePrice}`, columnPositions.salePrice, yPosition, { align: "center" });
        doc.text(`${product.totalStock}`, columnPositions.totalStock, yPosition, { align: "center" });
  
        // Add a clickable link and the image if the product has one
        if (product.image) {
          try {
            const img = await loadImageToBase64(product.image);
            const imageLink = product.image;  // Use product image URL for the link
  
            // Add clickable 'View Image' link
            doc.textWithLink('View Image', columnPositions.image + 30, yPosition, { url: imageLink });
  
            // Add the image thumbnail next to the link
            doc.addImage(img, "JPEG", columnPositions.image, yPosition - 5, 20, 20);
          } catch (error) {
            console.error("Error loading image", error);
          }
        }
  
        yPosition += 25; // Space for the next product
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      }
  
      // Save the PDF
      doc.save("products_report.pdf");
    } else {
      toast({ title: "No products available to generate a report." });
    }
  }
  
  

// Utility function to load an image from a URL and convert it to base64
function loadImageToBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
  });
}



  // Utility function to load an image from a URL and convert it to base64
  function loadImageToBase64(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
    });
  }

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
        <Button className="ml-2" onClick={generateReport}>
          Generate Report
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products && products.length > 0
            ? products.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadImageUrl={uploadImageUrl}
            setUploadImageUrl={setUploadImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
