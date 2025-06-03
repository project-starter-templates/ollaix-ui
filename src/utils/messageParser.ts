/**
 * Utilities for parsing and processing message content
 */
type ThinkingResult = {
  thinking: string;
  cleanContent: string;
};

/**
 * Extract “thinking” content from <think>...</think> tags
 */
export const extractThinkingContent = (content: string): ThinkingResult => {
  const thinkingRegex = /<think>([\s\S]*?)<\/think>/g;
  const thinkingMatches: string[] = [];
  let match;

  const tempContent = content;
  while ((match = thinkingRegex.exec(tempContent)) !== null) {
    thinkingMatches.push(match[1].trim());
  }

  const thinking = thinkingMatches.join("\n\n");
  const cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  return { thinking, cleanContent };
};

/**
 * Parse streaming content to identify thinking tags
 */
export const parseStreamingContent = (accumulatedText: string) => {
  const thinkStartTag = "<think>";
  const thinkEndTag = "</think>";

  let tempThinkingContent = "";
  let tempCleanContent = "";
  let isThinkingLoading = false;

  const startIndex = accumulatedText.indexOf(thinkStartTag);
  const endIndex = accumulatedText.indexOf(thinkEndTag);

  if (startIndex !== -1 && (endIndex === -1 || endIndex < startIndex)) {
    // Thinking in progress
    isThinkingLoading = true;
    tempThinkingContent = accumulatedText.substring(
      startIndex + thinkStartTag.length
    );
    tempCleanContent = accumulatedText.substring(0, startIndex);
  } else if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    // Thinking finished
    isThinkingLoading = false;
    tempThinkingContent = accumulatedText.substring(
      startIndex + thinkStartTag.length,
      endIndex
    );
    tempCleanContent =
      accumulatedText.substring(0, startIndex) +
      accumulatedText.substring(endIndex + thinkEndTag.length);
  } else {
    // No thinking tags
    isThinkingLoading = false;
    tempThinkingContent = "";
    tempCleanContent = accumulatedText;
  }

  return {
    thinkingContent: tempThinkingContent.trim(),
    cleanContent: tempCleanContent.trim(),
    isThinkingLoading,
  };
};
