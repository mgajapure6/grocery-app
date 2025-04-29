export const deepCopy = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    const copy = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      copy[key] = deepCopy(obj[key]);
    }
    return copy;
  };