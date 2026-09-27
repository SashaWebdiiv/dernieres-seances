/**
 * Espace insécable avant « ? ! : ; » (typographie française) : la ponctuation ne passe
 * jamais seule en début de ligne.
 */
export const insecables = (text: string): string => text.replace(/ ([?!:;])/g, " $1");
