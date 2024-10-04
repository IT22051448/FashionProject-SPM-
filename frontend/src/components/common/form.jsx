/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const types = {
  INPUT: "input",
  SELECT: "select",
  TEXTAREA: "textarea",
};

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  supplierOptions,
}) => {
  function renderInput(control) {
    let element = null;
    const value = formData[control.name] || "";

    const commonProps = {
      name: control.name,
      placeholder: control.placeholder,
      id: control.name,
      value: value,
      onChange: (e) =>
        setFormData({ ...formData, [control.name]: e.target.value }),
      readOnly: control.readOnly, // Add readOnly here
    };

    switch (control.componentType) {
      case types.INPUT:
        element = <Input {...commonProps} type={control.type} />;
        break;

      case types.SELECT:
        // Determine options based on the field
        const options =
          control.name === "supplier" ? supplierOptions : control.options;
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [control.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={control.label} />
            </SelectTrigger>
            <SelectContent>
              {options && options.length > 0
                ? options.map((option, index) => (
                    <SelectItem key={index} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case types.TEXTAREA:
        element = <Textarea {...commonProps} />;
        break;

      default:
        element = <Input {...commonProps} type={control.type} />;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control, index) => (
          <div className="w-full gap-1.5" key={index}>
            <Label className="mb-1">{control.label}</Label>
            {renderInput(control)}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-4 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

CommonForm.propTypes = {
  formControls: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  supplierOptions: PropTypes.array,
};

export default CommonForm;