// Load Google Translate script dynamically
function loadGoogleTranslate() {
  const script = document.createElement("script");
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(script);
}

// Initialize Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,hi,ta,te,bn',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    },
    'google_translate_element'
  );
}

// Make the init function globally accessible
window.googleTranslateElementInit = googleTranslateElementInit;

// Load the script on page load
window.addEventListener("load", loadGoogleTranslate);
