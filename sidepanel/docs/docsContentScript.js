function insertTextToDoc(text) {
    try {
        // Get the editable area
        const editableElement = document.querySelector('.docs-texteventtarget-iframe');
        if (!editableElement) {
            throw new Error('Could not find editable area');
        }

        // Create a new keyboard event
        const event = new KeyboardEvent('keydown', {
            key: 'v',
            code: 'KeyV',
            ctrlKey: true,
            bubbles: true
        });

        // Set clipboard data
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', text);
        
        // Create and dispatch paste event
        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: clipboardData,
            bubbles: true
        });

        // Focus and dispatch events
        editableElement.focus();
        editableElement.dispatchEvent(event);
        editableElement.dispatchEvent(pasteEvent);
    } catch (error) {
        console.error('Error inserting text:', error);
    }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insertText') {
        insertTextToDoc(request.text);
        sendResponse({ success: true });
    }
}); 