export const validateBoolean = (val: any) => {
  if (typeof val === "undefined") return false;
  if (val === "true") return true;
  return false;
};