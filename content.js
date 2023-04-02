function replaceSyriacCharacters(document) {
  const syriacLetters =
    "ܐܒܓܕܗܘܙܚܛܝܟܠܡܢܣܥܦܨܩܪܫܬ";
  const hebrewLetters = "אבגדהוזחטיכלמנסעפצקרשת";
  const targetTags = ["b", "a", "span"];

  const replaceText = (originalText) => {
    const regex = new RegExp(`[${syriacLetters}]`, "g");
    return originalText.replace(regex, (match) => {
      const index = syriacLetters.indexOf(match);
      return hebrewLetters.charAt(index);
    });
  };

  const processElement = (element) => {
    if (element.childNodes.length > 0) {
      for (const child of element.childNodes) {
        processElement(child);
      }
    } else {
      const originalText = element.textContent;
      const newText = replaceText(originalText);
      if (newText !== originalText) {
        element.textContent = newText;
      }
    }
  };

  for (const tag of targetTags) {
    const elements = document.getElementsByTagName(tag);
    for (const element of elements) {
      if (tag === "a") {
        const originalText = element.childNodes[0]?.nodeValue || "";
        const newText = replaceText(originalText);
        if (newText !== originalText) {
          element.childNodes[0].nodeValue = newText;
        }
      } else {
        const originalText = element.textContent;
        const newText = replaceText(originalText);
        if (newText !== originalText) {
          element.textContent = newText;
        }
      }
    }
  }

  const textNodes = document.evaluate(
    "//text()",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  for (let i = 0; i < textNodes.snapshotLength; i++) {
    const textNode = textNodes.snapshotItem(i);
    const originalText = textNode.textContent;
    const newText = replaceText(originalText);
    if (newText !== originalText) {
      textNode.textContent = newText;
    }
  }
}


(function () {
  replaceSyriacCharacters(document);
  addLinkEventListeners();
})();


function addLinkEventListeners() {
  const links = document.querySelectorAll("a");
  for (const link of links) {
    link.addEventListener("click", () => {
      setTimeout(() => {
        replaceSyriacCharacters(document);
      }, 500);
    });
  }
}


let lastContentHash = '';

function checkForContentChanges() {
  const iframe = document.querySelector("iframe");
  if (!iframe || !iframe.document) {
    return;
  }

  const currentContent = iframe.document.body.innerHTML;
  const currentHash = hashString(currentContent);

  if (currentHash !== lastContentHash) {
    replaceSyriacCharacters(iframe.document);
    addLinkEventListeners(); //
    lastContentHash = currentHash;
  }
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash;
}

setInterval(checkForContentChanges, 1000); // Check for changes every second
