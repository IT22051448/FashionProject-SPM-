export const loyaltyFormControls = [
  {
    name: "name",
    label: "Customer Name",
    placeholder: "Enter customer name",
    componentType: "input",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    componentType: "input",
    type: "email",
    readOnly: true,
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter phone number",
    componentType: "input",
    type: "tel",
    required: true,
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    componentType: "input",
    type: "date",
    required: true,
  },
  {
    name: "joinDate",
    label: "Join Date",
    componentType: "input",
    type: "date",
    readOnly: true,
  },
];
