/** Local palindrome check. Ignores spaces, punctuation, and case. Empty input is not a palindrome. */
export function isPalindrome(input: string): { status: "empty" | "ok"; isPalindrome: boolean; cleaned: string } {
  const cleaned = input.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
  if (!cleaned) return { status: "empty", isPalindrome: false, cleaned: "" };
  const reversed = cleaned.split("").reverse().join("");
  return { status: "ok", isPalindrome: cleaned === reversed, cleaned };
}

export const PALINDROME_SAMPLE = "A man, a plan, a canal: Panama";
export const PALINDROME_SAMPLE_ES = "Anita lava la tina";
