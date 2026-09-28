/**
 * Espaces insécables de la typographie française : avant « ? ! : ; » et à l'intérieur des
 * guillemets, pour qu'aucun signe ne passe seul en début ou en fin de ligne.
 */
export const insecables = (text: string): string =>
  text.replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ");
