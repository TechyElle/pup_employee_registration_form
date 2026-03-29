const form = document.getElementById("employeeForm");
const previewButton = document.getElementById("previewButton");
const previewContainer = document.getElementById("previewContainer");
const previewEmpty = document.getElementById("previewEmpty");
const closePreviewButton = document.getElementById("closePreview");
const fileInput = document.getElementById("supportingFile");
const fileStatus = document.getElementById("fileStatus");
const formMessage = document.getElementById("formMessage");

const readSelectedOptions = (selectName) => {
  const select = form.elements[selectName];

  return Array.from(select.selectedOptions, (option) => option.value);
};

const readCheckedValues = (inputName) => {
  return Array.from(
    form.querySelectorAll(`input[name="${inputName}"]:checked`),
    (input) => input.value
  );
};

// Keep preview formatting consistent even when optional fields are empty.
const buildFormSummary = () => {
  const formData = new FormData(form);
  const selectedLocations = readSelectedOptions("location");
  const selectedDocuments = readCheckedValues("documents");

  return [
    ["Full Name", formData.get("fullName") || "Not provided"],
    ["Employee ID", formData.get("employeeId") || "Not provided"],
    ["Email Address", formData.get("email") || "Not provided"],
    ["Department", formData.get("department") || "Not selected"],
    ["Preferred Work Location", selectedLocations.join(", ") || "Not selected"],
    ["Employment Type", formData.get("employmentType") || "Not selected"],
    ["Submitted Documents", selectedDocuments.join(", ") || "None"],
    ["Supporting File", fileInput.files[0]?.name || "No file selected"],
    ["Bio / Notes", formData.get("notes")?.trim() || "No additional notes"],
  ];
};

const updateMessage = (text = "", tone = "") => {
  formMessage.textContent = text;
  formMessage.className = "form-message";

  if (!text) {
    return;
  }

  formMessage.classList.add("is-visible");

  if (tone) {
    formMessage.classList.add(tone);
  }
};

const renderPreview = () => {
  const summary = buildFormSummary();

  previewContainer.innerHTML = "";

  summary.forEach(([label, value]) => {
    const item = document.createElement("article");
    const labelText = document.createElement("span");
    const valueText = document.createElement("p");

    item.className = "preview-item";
    labelText.className = "preview-label";
    valueText.className = "preview-value";

    labelText.textContent = label;
    valueText.textContent = value;

    item.append(labelText, valueText);
    previewContainer.appendChild(item);
  });

  previewEmpty.hidden = true;
  previewContainer.hidden = false;
};

const hidePreview = () => {
  previewContainer.hidden = true;
  previewContainer.innerHTML = "";
  previewEmpty.hidden = false;
};

const validateForm = () => {
  const isValid = form.checkValidity();

  if (!isValid) {
    form.reportValidity();
    updateMessage("Please complete the required fields before continuing.", "is-warning");
  }

  return isValid;
};

previewButton.addEventListener("click", () => {
  if (!validateForm()) {
    return;
  }

  renderPreview();
  updateMessage("Preview updated. Review the summary panel before submitting.", "is-success");
});

closePreviewButton.addEventListener("click", () => {
  hidePreview();
  updateMessage("Preview hidden.", "is-warning");
});

fileInput.addEventListener("change", () => {
  fileStatus.textContent = fileInput.files[0]?.name || "No file selected";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  renderPreview();
  updateMessage("Application submitted successfully.", "is-success");
  form.reset();
  fileStatus.textContent = "No file selected";
});
