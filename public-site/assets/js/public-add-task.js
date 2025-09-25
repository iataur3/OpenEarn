function previewScreenshot(inputElement) {
  const file = inputElement.files[0];
  const previewContainer = inputElement.nextElementSibling;
  const previewImage = previewContainer.querySelector("img");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewContainer.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
}

function submitTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const rules = document.getElementById("taskRules").value.trim();

  if (!title || !rules) {
    alert("⚠️ Please fill in the task title and rules.");
    return;
  }

  document.getElementById("taskModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("taskModal").classList.add("hidden");
}
