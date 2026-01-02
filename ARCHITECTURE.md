# 핵심 로직 문서

  ## 구조

  ### * /src/utils/observer.js
  * React-Redux의 useSelector 역할
  * selector에 등록한 state가 바뀌었을 때만 onChange 호출
  * `===` 로 state 객체 전후 비교하면 주소 기반으로 객체 비교해버림
  * 주소가 아닌 내용물 기반 비교를 위해 shallowEqual 도입
      * shallowEqual이므로 Nested object 안쓰게 유의 필요

### * /src/utils/compare.js
* `shallowEqual` 함수 구현
* 객체의 1 depth 속성들을 순회하며 값 비교
* 주의: 중첩 객체(nested object)는 비교하지 않음
* 배열 참조 변경도 감지 가능 (배열 자체가 참조 타입이므로)

### * /src/store/store.js
* 중앙 집중식 상태 관리 클래스
* Redux 패턴 기반 구현
* `dispatch(actionType, payload)`: 상태 변경 트리거
* `subscribe(callback)`: 상태 변경 시 콜백 등록
* `notify()`: 모든 구독자에게 상태 변경 알림
* 불변성 유지: `getState()`는 state의 복사본 반환

### * /src/store/index.js
* 애플리케이션 상태 초기값 및 리듀서 정의
* 상태 구조:
    * `allPress`: 전체 언론사 리스트
    * `subscribedIds`: 구독한 언론사 ID 배열
    * `currentTab`: 현재 탭 ('all' | 'subscribed')
    * `currentPage`: 현재 페이지 번호
* 액션 타입:
    * `SET_TAB`: 탭 변경 (페이지도 0으로 리셋)
    * `SUBSCRIBE`: 구독 추가 (구독 탭일 때만 페이지 리셋)
    * `UNSUBSCRIBE`: 구독 해지 (구독 탭일 때만 페이지 리셋)
    * `SET_PAGE`: 페이지 직접 설정
    * `NEXT_PAGE`: 다음 페이지
    * `PREV_PAGE`: 이전 페이지

### * /src/app.js
* 애플리케이션 진입점
* Selector 패턴: `selectFilteredPress`로 데이터 가공 로직 분리
* 순수 함수 패턴: `updateNewsContent`는 데이터를 인자로 받아 렌더링만 수행
* Observer 패턴:
    * 헤더 영역: 탭 및 구독 수 변경 감지
    * 뉴스 컨텐츠 영역: 탭 및 구독 리스트 변경 감지
* 초기 렌더링 최적화:
    * 정적 컴포넌트는 한 번만 렌더링
    * 동적 컴포넌트는 observer에서 자동 처리 (초기 상태도 포함)

## 데이터 흐름

1. **사용자 액션** → `dispatch(actionType, payload)`
2. **리듀서 실행** → 새로운 상태 반환 (불변성 유지)
3. **Store.notify()** → 모든 구독자에게 알림
4. **observeStore.handleChange()** → selector로 현재 관심 상태 추출
5. **비교 로직** → shallowEqual 또는 `===` 비교
6. **변경 감지 시** → onChange 콜백 실행
7. **렌더링 함수** → DOM 업데이트

## 성능 최적화 포인트

1. **shallowEqual 도입**: 객체 참조가 아닌 내용 기반 비교로 불필요한 렌더링 방지
2. **Selector 분리**: 관심 있는 상태만 추출하여 비교 비용 감소
3. **Observer 분리**: 헤더와 컨텐츠를 별도로 관찰하여 렌더링 범위 최소화
4. **순수 함수**: 테스트 가능하고 재사용 가능한 구조
5. **초기 렌더링 중복 제거**: observer 내부 handleChange() 호출로 자동 처리

## 엣지 케이스 해결 전략

### 1. 그리드 뷰 / 전체 언론사의 두 번째 페이지에서 구독하기를 누르면 첫 번째 페이지로 이동하는 현상
**해결 방법**: `src/store/index.js`의 리듀서에서 조건부 페이지 리셋 로직 적용
```javascript
case 'SUBSCRIBE': {
  const updatedSubscribed = [...state.subscribedIds, payload];
  const resetPage = state.currentTab === 'subscribed' ? 0 : state.currentPage;
  return { ...state, subscribedIds: updatedSubscribed, currentPage: resetPage };
}
```
* **전체 탭(`currentTab === 'all'`)**: 현재 페이지 유지 (`state.currentPage`)
* **구독 탭(`currentTab === 'subscribed'`)**: 페이지를 0으로 리셋
* **원리**: 전체 탭에서는 목록이 변경되지 않으므로 사용자의 현재 위치를 보존

### 2. 그리드 뷰 / 내가 구독한 언론사에서 좌우 화살표가 전체 언론사 기준으로 나오는 현상
**해결 방법**: `src/app.js`의 `selectFilteredPress`로 탭별 필터링된 리스트 전달
```javascript
const selectFilteredPress = (state) => {
  if (state.currentTab === 'subscribed') {
    const subscribedSet = new Set(state.subscribedIds);
    return allPress.filter((press) => subscribedSet.has(press.name));
  }
  return allPress;
};
```
* **원리**: `renderNewsGrid`는 받은 `pressList`를 기준으로 `pages` 배열을 생성
* 화살표 표시 조건(`pages.length > 1`)은 필터링된 리스트 기준으로 계산됨
* 따라서 현재 탭의 실제 항목 수에 맞게 화살표가 표시/숨김됨

### 3. 그리드 뷰 / 내가 구독한 언론사의 언론사 양이 2페이지 이상일 때, 해지를 해서 1페이지로 줄어들면 첫 번째 페이지로 이동하지 않는 현상
**해결 방법 1**: 리듀서에서 구독 탭일 때 페이지 리셋
```javascript
case 'UNSUBSCRIBE': {
  const updatedSubscribed = state.subscribedIds.filter((id) => id !== payload);
  const resetPage = state.currentTab === 'subscribed' ? 0 : state.currentPage;
  return { ...state, subscribedIds: updatedSubscribed, currentPage: resetPage };
}
```
**해결 방법 2**: `src/components/news-grid/newsGrid.js`에서 페이지 수 변경 시 화살표 제거
```javascript
// renderNewsGrid 함수 내부
if (pages.length > 1) {
  // 화살표 생성 로직
} else {
  // 페이지가 1 이하이면 버튼 참조 제거
  prevBtn = null;
  nextBtn = null;
}
```
* **추가 보호**: `observeStore`가 구독 리스트 변경을 감지하여 `renderNewsGrid`를 다시 호출
* 재렌더링 시 새로운 `pages.length`로 화살표 생성/제거가 자동으로 처리됨

## 주의사항

* `shallowEqual`은 1 depth만 비교하므로 중첩 객체 사용 시 주의
* selector에서 매번 새로운 객체를 반환하더라도 내용이 같으면 렌더링되지 않음
* 배열 참조 변경은 감지되지만, 배열 내부 요소 변경은 감지되지 않음
* 구독 해지 시 메모리 누수 방지를 위해 unsubscribe 함수 활용 가능
* 페이지 상태는 탭과 구독 상태에 따라 조건부로 관리되어야 함

