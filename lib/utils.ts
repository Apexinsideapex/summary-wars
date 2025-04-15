import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitTranscript(transcript: string) {
  if (!transcript || typeof transcript !== 'string') {
    return [];
  }

  // Regular expression to match "Me:" or "Them:" followed by any text
  const speakerRegex = /(?:^|\s+)(Me:|Them:)\s*/g;
  
  // Split the transcript by speaker markers, including the markers
  const segments = [];
  let lastIndex = 0;
  let match;
  
  // Find all speaker markers
  while ((match = speakerRegex.exec(transcript)) !== null) {
    const speaker = match[1].replace(':', '');
    const startIndex = match.index + match[0].length;
    
    // If this isn't the first match, save the previous segment
    if (lastIndex > 0) {
      const previousSpeakerEndIndex = match.index;
      const text = transcript.substring(lastIndex, previousSpeakerEndIndex).trim();
      
      if (text) {
        segments[segments.length - 1].text = text;
      }
    }
    
    // Add the new speaker
    segments.push({
      speaker,
      text: "" // Will be filled in the next iteration or after the loop
    });
    
    lastIndex = startIndex;
  }
  
  // Handle the last segment
  if (segments.length > 0 && lastIndex < transcript.length) {
    segments[segments.length - 1].text = transcript.substring(lastIndex).trim();
  }
  
  return segments.filter(segment => segment.text);
}