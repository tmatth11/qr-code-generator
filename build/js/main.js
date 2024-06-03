const form = document.getElementById("form");
const codeInput = document.getElementById("code-input");
const submitBtn = document.getElementById("submit");
const codeContainer = document.getElementById("code-container");
const qrCode = document.getElementById("qr-code");
const copyBtn = document.getElementById("copy");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = codeInput.value;

    if (text.length === 0) {
        alert("Please enter a code.");
        return;
    }

    codeContainer.classList.replace("hidden", "flex");
    fetch('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(text))
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then((myBlob) => {
        const objectURL = URL.createObjectURL(myBlob);
        qrCode.src = objectURL;
    })
    .catch((error) => {
        alert('There has been a problem with your fetch operation:', error);
    });

    copyBtn.addEventListener('click', () => {
        if (!window.isSecureContext) {
            alert('Your connection is not secure. Clipboard operations are only available in a secure context.');
            return;
        }
    
        if (!navigator.clipboard || !window.ClipboardItem || !fetch) {
            alert('Your browser does not support the required Clipboard API features.');
            return;
        }
    
        fetch(qrCode.src)
            .then(response => response.blob())
            .then(blob => {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item])
                    .then(() => alert('QR code copied to clipboard!'))
                    .catch(error => alert('Failed to copy QR code to clipboard: ' + error));
            })
            .catch(error => alert('Failed to fetch QR code for clipboard: ' + error));
    });
});
