/**
 * EAGER DATA에서 그리드 데이터를 파싱하는 유틸리티
 */

/**
 * EAGER DATA 구조에서 그리드 블록 배열을 추출
 * @returns {Array} 그리드 블록 배열
 */
export function getGridBlocksFromEagerData() {
  try {
    const eagerData = window['EAGER-DATA'];
    if (!eagerData || !eagerData['PC-MEDIA-WRAPPER']) {
      console.warn('EAGER-DATA not found or PC-MEDIA-WRAPPER not available');
      return [];
    }

    const wrapper = eagerData['PC-MEDIA-WRAPPER'];
    
    if (
      wrapper?.blocks?.[0]?.blocks?.[0]?.blocks &&
      Array.isArray(wrapper.blocks[0].blocks[0].blocks)
    ) {
      return wrapper.blocks[0].blocks[0].blocks;
    }

    return [];
  } catch (error) {
    console.error('Error parsing EAGER-DATA:', error);
    return [];
  }
}

/**
 * 그리드 블록에서 그리드 아이템 정보 추출
 * @param {Object} block - PC-NEWSSTAND-PRESS-BLOCK 객체
 * @returns {Object|null} 그리드 아이템 정보 { id, name, logoDark, logoLight }
 */
function extractGridItemFromBlock(block) {
  if (!block || block['@type'] !== 'PC-NEWSSTAND-PRESS-BLOCK') {
    return null;
  }

  const {pid, name, logoDark, logoLight} = block;
  
  if (!logoDark && !logoLight) {
    return null;
  }
  
  return {
    id: pid,
    name,
    logoDark, 
    logoLight, 
  };
}

/**
 * EAGER DATA에서 그리드 데이터 추출
 * @returns {Array} 그리드 아이템 리스트
 */
export function parseGridDataFromEagerData() {
  const blocks = getGridBlocksFromEagerData();
  
  const gridItems = blocks
    .map(extractGridItemFromBlock)
    .filter((item) => item !== null);

  return gridItems;
}

