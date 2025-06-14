/**
 * Extracts plain text from HTML content and limits it to a specified length
 */
export function extractTextFromHtml(html: string, maxLength = 150): string {
    // Create a temporary div to parse the HTML
    if (typeof document !== "undefined") {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = html
  
      // Remove any img tags first
      const images = tempDiv.getElementsByTagName("img")
      while (images.length > 0) {
        images[0].parentNode?.removeChild(images[0])
      }
  
      // Get text content and remove extra whitespace
      let text = tempDiv.textContent || tempDiv.innerText || ""
      text = text.replace(/\s+/g, " ").trim()
  
      // Limit to maxLength characters
      if (text.length > maxLength) {
        text = text.substring(0, maxLength) + "..."
      }
  
      return text
    } else {
      // Server-side fallback (less accurate but works without DOM)
      const textWithoutTags = html
        .replace(/<img[^>]*>/g, "") // Remove img tags first
        .replace(/<[^>]*>/g, " ") // Replace other tags with space
      const text = textWithoutTags.replace(/\s+/g, " ").trim()
  
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "..."
      }
  
      return text
    }
  }
  
  