export const parseSection = (
    section: string
  ): { title: string; points: string[] } => {
    const [title, ...content] = section.split('\n');
    const cleanTitle = title.startsWith('#') ? title.substring(1).trim() : title.trim();
    // Join all lines after the title into a single string for the body
    const body = content.join('\n').trim();
    // Split by double newlines to get paragraphs or logical points
    const points = body ? body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) : [];
    return {
      title: cleanTitle,
      points,
    };
  };
  
  export function parsePoint(point: string) {
    const isNumbered = /^\d+\./.test(point);
    const isMainPoint = /^•/.test(point);
    // Replace the Unicode property escape with a simpler emoji detection
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
    const hasEmoji = emojiRegex.test(point);
    const isEmpty = !point.trim();
  
    return { isNumbered, isMainPoint, hasEmoji, isEmpty };
  }
  
  // Helper to split an emoji from point text
  export function parseEmojiPoint(content: string) {
    const cleanContent = content.replace(/^[•]\s*/, '').trim();
    const matches = cleanContent.match(/^(\p{Emoji}+)\s*(.+)$/u);
  
    if (!matches) return null;
  
    const [, emoji, text] = matches;
    return {
      emoji: emoji.trim(),
      text: text.trim(),
    };
  }