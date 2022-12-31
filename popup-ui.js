// Handle form submission
const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Get input text
  const input = document.querySelector('#input').value;

  // Send request to OpenAI GPT-3 API
  fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // [EDITABLE] set your api token here, from sk foward that's the api key
      'Authorization': 'Bearer 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',}, 
    body: JSON.stringify({
      'prompt': "Create a Google Sheets formula that" + input,
      'temperature': 0.7, // [EDITABLE] set how literal
      'model': 'text-davinci-003',
      'max_tokens': 50,  // [EDITABLE] set the maximum number of tokens here

    }),
  })
  .then(response => response.json())
  .then(response => {
    // Extract the text from the first choice in the choices array
    const text = response.choices[0].text;

    // Send message to popup.js to display generated text
    chrome.runtime.sendMessage({formula: text});
  });
});
// Handle copy button click
const copyButton = document.querySelector('#copy-button');
copyButton.addEventListener('click', async function() {
  // Get the formula from the result div
  const resultDiv = document.querySelector('#result');
  const formula = resultDiv.textContent;

  // Copy formula to clipboard using Asynchronous Clipboard API
  try {
    await navigator.clipboard.writeText(formula);
    // Display success message
    const successMessage = document.querySelector('#success-message');
    successMessage.style.display = 'block';
  } catch (error) {
    console.error(error);
  }
});

// Handle regenerate button click
const regenerateButton = document.querySelector('#regenerate-button');
regenerateButton.addEventListener('click', function() {
  // Get the input text
  const input = document.querySelector('#input').value;

  // Re-submit the form with the same input text
  form.dispatchEvent(new Event('submit'));
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.formula) {
    // Display generated formula in result div
    const resultDiv = document.querySelector('#result');
    resultDiv.textContent = request.formula;

    // Enable copy and regenerate buttons
    copyButton.disabled = false;
    regenerateButton.disabled = false;
  } else if (request.regenerate) {
    // Disable copy and regenerate buttons
    copyButton.disabled = true;
    regenerateButton.disabled = true;

    // Clear result div
    const resultDiv = document.querySelector('#result');
    resultDiv.textContent = '';
  }
});