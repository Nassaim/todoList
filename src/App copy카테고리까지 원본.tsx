import { useCallback, useState } from 'react';

// 객체
type TData = {
  title: string;
};

function App() {
  // 타입 설정 및 배열인 경우에는 Tdata[] 이라고 명시해줌
  // 가상DB
  const [datum, setDatum] = useState<TData[]>([]);
  const [createDatum, setCreateDatum] = useState<TData[]>([]); // 엔터를 누르기 전까지는 input
  const [createInput, setCreateInput] = useState(''); // createInput 값 변경용
  const [createFlag, setCreateFlag] = useState(false); // false : 추가버튼 보임, true : 안보임

  // 삭제하기 (data 객체 받을 때 어떤 타입인지 꼭 명시하기)
  const deleteHandler = useCallback(
    (idx: number) => {
      // console.log('deleteHandler 내용 확인 >> ', data, idx);
      // 확인
      if (window.confirm('삭제하시겠습니까?')) {
        let data = datum ? datum.map((value) => value) : [];

        data.splice(idx, 1); // 배열에서 idx 1개만 삭제한다.
        setDatum(data);
      }
    },
    [datum]
  );

  // 실제 DB 저장하기
  // data  = createInput 값임
  const dbCreateHandler = useCallback(
    (data: string) => {
      // console.log('dbcreateHandler >> ', data);

      let result = datum ? datum.map((value) => value) : [];

      result.push({
        title: data,
      });

      setDatum(result);
      setCreateDatum([]); // 엔터후 input창 초기화
      setCreateFlag(false);
    },
    [datum]
  ); // [datum] useCallback 쓰고 난 후에 값 저장해서 새값 가져오도록 하기

  // 생성
  const createHandler = useCallback(() => {
    // ...datum이랑 같음
    let data = createDatum ? createDatum.map((value) => value) : [];

    data.push({
      // title: `이름 ${createDatum.length + 1}`,
      title: `이름 ${datum.length + 1}`,
    });

    // setDatum(data);
    setCreateDatum(data);
    setCreateInput(`이름 ${datum.length + 1}`);
    setCreateFlag(true);
  }, [createDatum, datum]);

  console.log(createDatum);

  return (
    <>
      <div
        style={{
          display: `flex`,
          flexDirection: `row`,
          width: `100%`,
          height: `100vh`,
        }}
      >
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
          {/* 카테고리 삽입 위치  */}
          <div
            style={{
              height: `calc(100% - 50px - 10px)`,
              display: `flex`,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
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
                  {/* <input value={data.title} /> */}
                  <input
                    value={createInput}
                    // onChange={(e) => console.log(e.target.value)}
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
            style={{ height: `50px`, display: createFlag ? `none` : `initial` }}
            onClick={createHandler}
          >
            추가
          </button>
        </div>
        <div
          style={{
            display: `flex`,
            width: `80%`,
            height: `100%`,
            border: `1px solid #909090`,
          }}
        ></div>
      </div>
    </>
  );
}

export default App;
