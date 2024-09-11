import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const OrderSuccess = () => {
  return (
    <div className="flex flex1 items-center justify-center w-full h-full py-10">
      <Card>
        <CardHeader>
          <CardTitle>Processing Payment...Please wait!</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default OrderSuccess;
