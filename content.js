// Define the exchangeCharacters function
function exchangeCharacters(inputText) {
  const syriacLetters = "ܐܒܓܕܗܘܙܚܛܝܟܠܡܢܣܥܦܨܩܪܫܬܡܢܨܦܟ";
  const hebrewLetters = "אבגדהוזחטיכלמנסעפצקרשתםןץףך";

  let outputText = "";

  for (let i = 0; i < inputText.length; i++) {
    const inputChar = inputText.charAt(i);
    const index = syriacLetters.indexOf(inputChar);
    if (index !== -1) {
      outputText += hebrewLetters.charAt(index);
    } else {
      outputText += inputChar;
    }
  }

  return outputText;
}

// Find all text nodes on the webpage
const textNodes = document.evaluate(
  "//text()",
  document,
  null,
  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
  null
);

// Replace Syriac characters with Hebrew characters in each text node
for (let i = 0; i < textNodes.snapshotLength; i++) {
  const textNode = textNodes.snapshotItem(i);
  const originalText = textNode.textContent;
  const newText = exchangeCharacters(originalText);
  if (originalText !== newText) {
    textNode.textContent = newText;
  }
}
