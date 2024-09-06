/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue } from "../ui/select";
import { SelectContent, SelectItem } from "@radix-ui/react-select";
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
}) => {
  function renderInput(control) {
    let element = null;
    const value = formData[control.name] || "";

    const inputProps = {
      name: control.name,
      placeholder: control.placeholder,
      id: control.name,
      type: control.type,
      value: value,
      onChange: (e) =>
        setFormData({ ...formData, [control.name]: e.target.value }),
      readOnly: control.readOnly || false,
    };

    switch (control.componentType) {
      case types.INPUT:
        element = <Input {...inputProps} />;
        break;

      case types.SELECT:
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, [control.name]: value })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={control.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {control.options && control.options.length > 0
                ? control.options.map((option, index) => (
                    <SelectItem key={index} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case types.TEXTAREA:
        element = (
          <Textarea
            name={control.name}
            placeholder={control.placeholder}
            id={control.name}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [control.name]: e.target.value })
            }
          />
        );
        break;

      default:
        element = <Input {...inputProps} />;
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
};

export default CommonForm;
