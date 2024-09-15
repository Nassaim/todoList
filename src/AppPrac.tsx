import { useCallback, useState } from 'react';

// 객체(VO)
type TData = {
  title: string;
};

function AppPrac() {
  const [datum, setDatum] = useState<TData[]>([]);
  const [createDatum, setCreateDatum] = useState<TData[]>([]); // 엔터 누르기 전 input용
  const [createInput, setCreateInput] = useState(''); // div 값 표출용
  const [createFlag, setCreateFlag] = useState(false); // false :추가버튼 안 보임

  // 삭제하기
  const deleteHandler = useCallback(
    (idx: number) => {
      console.log('deleteHandler 내용 확인 >> ', idx);

      if (window.confirm('삭제하시겠습니가~~')) {
        let data = datum ? datum.map((value) => value) : [];

        data.splice(idx, 1); // 배열에서 idx 한개 삭제
        setDatum(data);
      }
    },
    [datum]
  );

  // 실제 DB 저장하기
  const dbCreateHandler = useCallback(
    (data: string) => {
      let result = datum ? datum.map((value) => value) : [];
      console.log('dbCreateHandler  작동 >> ', data);

      result.push({
        title: data,
      });

      setDatum(result);
      setCreateDatum([]); // 엔터후 input창 초기화
      setCreateFlag(false);
    },
    [datum]
  );

  // 버튼 클릭 이벤트
  const createHandler = useCallback(() => {
    let data = createDatum ? createDatum.map((value) => value) : [];

    data.push({
      title: `제목 ${datum.length + 1}`,
    });

    console.log('버튼 클릭 >> ', datum);

    // setDatum(data);
    setCreateDatum(data);
    setCreateInput(`제목 ${datum.length + 1}`); // div 표출용
    setCreateFlag(true);
  }, [createDatum, datum]);

  // console.log('datum>> ', datum);

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `row`,
        width: `100%`,
        height: `100vh`,
      }}
    >
      {/* 세로 div */}
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          width: `20%`,
          height: `100%`,
          border: `1px solid #909090`,
          justifyContent: `space-between`,
          padding: `10px`,
        }}
      >
        <div
          style={{
            height: `calc(100% - 50px - 10px)`,
            display: `flex`,
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {' '}
          {/* 추가할div */}
          {datum.map((data, idx) => {
            return (
              <div
                key={idx}
                style={{
                  padding: `10px`,
                  height: `80px`,
                  width: `100%`,
                  border: `1px solid #808080`,
                  margin: `0 0 10px`,
                }}
                onClick={() => deleteHandler(idx)}
              >
                {data.title}
              </div>
            );
          })}
          {createDatum.map((data, idx) => {
            return (
              <div
                key={idx}
                style={{
                  padding: `10px`,
                  height: `80px`,
                  width: `100%`,
                  border: `1px solid #808080`,
                  margin: `0 0 10px`,
                }}
              >
                <input
                  value={createInput}
                  onChange={(e) => setCreateInput(e.target.value)}
                  // 엔터일 때 실행
                  onKeyDown={(e) =>
                    e.keyCode === 13 && dbCreateHandler(createInput)
                  }
                />
              </div>
            );
          })}
        </div>
        <button
          style={{
            height: `50px`,
            backgroundColor: `blue`,
            color: `white`,
            display: createFlag ? `none` : `initial`,
          }}
          onClick={createHandler}
        >
          카테고리 추가
        </button>
      </div>
      {/* 오른쪽 todoList 페이지 */}
      <div
        style={{
          display: `flex`,
          width: `80%`,
          height: `100%`,
          border: `1px solid #909090`,
        }}
      ></div>
    </div>
  );
}

export default AppPrac;
