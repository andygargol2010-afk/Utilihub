export function generateRandomId(length=8){
  const alphabet="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const values=new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values,v=>alphabet[v%alphabet.length]).join("");
}
