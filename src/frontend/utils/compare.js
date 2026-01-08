export const shallowEqual = (objA, objB) => {
  if (objA === objB) return true;
  if (objA == null || objB == null) return false;
  
  // 배열 비교
  if (Array.isArray(objA) && Array.isArray(objB)) {
    if (objA.length !== objB.length) return false;
    for (let i = 0; i < objA.length; i++) {
      if (objA[i] !== objB[i]) return false;
    }
    return true;
  }
  
  // 객체 비교
  if (typeof objA !== 'object' || typeof objB !== 'object') return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
};


