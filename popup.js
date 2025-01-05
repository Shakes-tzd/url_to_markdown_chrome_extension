// Button elements
const copyButton = document.getElementById("copy");
const saveButton = document.getElementById("save");
const status = document.getElementById("status");

// Function to fetch Markdown
async function fetchMarkdown() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabURL = tab.url;

  const apiURL = `https://urltomarkdown.herokuapp.com/?url=${encodeURIComponent(tabURL)}&title=true&links=true`;

  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return await response.text();
  } catch (error) {
    console.error("Error fetching Markdown:", error);
    status.textContent = "Failed to fetch Markdown. Please try again.";
    throw error;
  }
}

// Copy Markdown to Clipboard
copyButton.addEventListener("click", async () => {
  status.textContent = "Fetching Markdown...";
  try {
    const markdown = await fetchMarkdown();
    await navigator.clipboard.writeText(markdown);
    status.textContent = "Markdown copied to clipboard!";
  } catch {
    status.textContent = "Failed to copy Markdown.";
  }
});

// Save Markdown as File
saveButton.addEventListener("click", async () => {
  status.textContent = "Fetching Markdown...";
  try {
    const markdown = await fetchMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const blobURL = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobURL;
    link.download = "page.md";
    link.click();

    URL.revokeObjectURL(blobURL);
    status.textContent = "Markdown file saved!";
  } catch {
    status.textContent = "Failed to save Markdown.";
  }
});
