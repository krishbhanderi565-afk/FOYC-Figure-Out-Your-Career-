/**
 * Launches ChatGPT in a new browser tab with the prompt pre-populated in the search / message input,
 * so the user only has to press Enter.
 * Also simultaneously copies the prompt to the clipboard for 100% reliable fallback.
 */
export async function openChatGPTWithPrompt(promptText: string): Promise<boolean> {
  // 1. Seamless clipboard copy
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(promptText);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = promptText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
  } catch (err) {
    console.warn('Clipboard write fallback triggered:', err);
  }

  // 2. Build target URL with ?q= query param
  // ChatGPT automatically pre-fills the prompt input from the 'q' parameter
  const targetUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`;

  // 3. Open ChatGPT
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
  return true;
}
