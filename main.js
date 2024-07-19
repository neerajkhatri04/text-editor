import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("text-area");
  const addTextButton = document.getElementById("add-text");
  const textInput = document.getElementById("text-input");
  const fontSizeInput = document.getElementById("font-size");
  const fontColorInput = document.getElementById("font-color");
  const fontFamilyInput = document.getElementById("font-family");

  let selectedTextElement = null;

  addTextButton.addEventListener("click", () => {
    // Get input value from text-area
    const textContent = textInput.value.trim();

    // Set the properties
    if (textContent) {
      const textElement = document.createElement("p");
      textElement.className = "text";
      textElement.contentEditable = "true";
      textElement.textContent = textContent;
      textElement.style.fontSize = `${fontSizeInput.value}px`;
      textElement.style.color = fontColorInput.value;
      textElement.style.fontFamily = fontFamilyInput.value;
      textElement.style.position = "absolute";
      textElement.style.left = "20px";
      textElement.style.top = "20px";
      container.appendChild(textElement);
      dragAndDrop(textElement);
    }
  });

  function dragAndDrop(element) {
    element.addEventListener("mousedown", function (e) {
      selectedTextElement = element;
      let offsetX = e.clientX - selectedTextElement.offsetLeft;
      let offsetY = e.clientY - selectedTextElement.offsetTop;

      function mouseMoveHandler(e) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = selectedTextElement.getBoundingClientRect();

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Boundary checks
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + elementRect.width > containerRect.width)
          newX = containerRect.width - elementRect.width;
        if (newY + elementRect.height > containerRect.height)
          newY = containerRect.height - elementRect.height;

        selectedTextElement.style.left = `${newX}px`;
        selectedTextElement.style.top = `${newY}px`;
      }

      function reset() {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", reset);
        selectedTextElement = null;
        element.style.border = "none"; // Remove border when deselected
      }

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", reset);
    });

    element.addEventListener("click", () => {
      selectedTextElement = element;
      fontSizeInput.value = parseInt(window.getComputedStyle(element).fontSize);
      fontColorInput.value = rgbToHex(window.getComputedStyle(element).color);
      fontFamilyInput.value = window.getComputedStyle(element).fontFamily;
    });
  }

  fontSizeInput.addEventListener("input", () => {
    if (selectedTextElement) {
      selectedTextElement.style.fontSize = `${fontSizeInput.value}px`;
    }
  });

  fontColorInput.addEventListener("input", () => {
    if (selectedTextElement) {
      selectedTextElement.style.color = fontColorInput.value;
    }
  });

  fontFamilyInput.addEventListener("input", () => {
    if (selectedTextElement) {
      selectedTextElement.style.fontFamily = fontFamilyInput.value;
    }
  });

  function rgbToHex(rgb) {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    return result
      ? `#${(
          (1 << 24) +
          (parseInt(result[1]) << 16) +
          (parseInt(result[2]) << 8) +
          parseInt(result[3])
        )
          .toString(16)
          .slice(1)
          .toUpperCase()}`
      : rgb;
  }
});
