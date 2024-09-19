import { useCallback, useState } from 'react';

// 객체
type TData = {
  cateNo: string;
  title: string;
};

// detail TABLE
type DetailVO = {
  detailNo: string;
  cateNo: string;
  orderNo: number;
  content: string;
  startDt: Date;
  endDt: Date;
  regDate: Date;
  checkYN: string; // default : N
};

function App() {
  // 타입 설정 및 배열인 경우에는 Tdata[] 이라고 명시해줌
  // 가상DB
  const [datum, setDatum] = useState<TData[]>([]);
  const [detailTable, setDetailTable] = useState<DetailVO[]>([]);

  const [createDatum, setCreateDatum] = useState<TData[]>([]); // 엔터를 누르기 전까지는 input
  const [createInput, setCreateInput] = useState(''); // createInput 값 변경용
  const [createFlag, setCreateFlag] = useState(false); // false : 추가버튼 보임, true : 안보임
  const [createDetailDiv, setCreateDetailDiv] = useState<TData | null>(null);
  const [mdfyCateFlag, setMdfyCateFlag] = useState(true); // true : readonly

  // detail
  const [detailInput, setDetailInput] = useState(''); // 작업추가용 값

  // todo 내용 Insert
  const insertTodoDetailHandler = useCallback(
    (content: string, cateNo: string) => {
      let data = detailTable ? detailTable.map((value) => value) : [];

      console.log('작업추가 내용 확인 >>', content, 'cateNo >> ', cateNo);

      // 내일 두개 제외 다른 것들 도 연결필요

      if (content != null && content != '') {
        // data.push({
        // detailNo: string;
        // cateNo: string;
        // orderNo: number;
        // content: content;
        // startDt: date
        // endDt: Date;
        // regDate: Date;
        // checkYN: string; // default : N
        // });
      }

      setDetailInput('');
    },
    []
  );

  // 카테고리 타이틀 수정
  // const mdfyCateTitleHandler = useCallback((detailVO: TData) => {
  const mdfyCateTitleHandler = useCallback(
    (detailVO: TData) => {
      let data = datum ? datum.map((value) => value) : [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].cateNo == detailVO.cateNo) {
          data[i].title = detailVO.title;
        }
      }

      setDatum(data);
      // setCreateDetailDiv(data);
    },
    [datum]
  );

  // 삭제하기 (data 객체 받을 때 어떤 타입인지 꼭 명시하기)
  const deleteHandler = useCallback(
    (cateNo: string) => {
      console.log('deleteHandler 삭제할 카테고리 번호 확인 >> ', cateNo);
      // 확인
      if (window.confirm('삭제하시겠습니까?')) {
        let data = datum ? datum.map((value) => value) : [];

        // data.splice(cateNo, 1); // 배열에서 idx 1개만 삭제한다.
        if (data != null) {
          for (let i = 0; i < data.length; i++) {
            const arrCateNo = data[i].cateNo;
            if (arrCateNo == cateNo) {
              data.splice(i, 1);
            }
          }
        }
        setDatum(data);
        setCreateDetailDiv(null); // 내용 div 삭제
      }
    },
    [datum]
  );

  const showDetailHandler = useCallback(
    (idx: number) => {
      console.log('showDetailHandler 클릭 >> ', idx);
      // let data = datum ? datum.map((value) => value) : [];
      let data = datum[idx];

      // console.log('showDetailHandler의 data 확인 > ', data.title);

      setCreateDetailDiv(data);
      // setCreateDetailDiv([]);
    },
    [datum]
  );

  // 실제 DB 저장하기
  // data  = createInput 값임
  const dbCreateHandler = useCallback(
    (data: string, cateNo: string) => {
      console.log('dbcreateHandler >> ', data, ' cateNo >> ', cateNo);

      let result = datum ? datum.map((value) => value) : [];

      result.push({
        title: data,
        cateNo: cateNo,
      });

      setDatum(result);
      console.log('디비 내용 확인 >> ', datum);
      setCreateDatum([]); // 엔터후 input창 초기화
      setCreateFlag(false);
    },
    [datum]
  ); // [datum] useCallback 쓰고 난 후에 값 저장해서 새값 가져오도록 하기

  // 생성
  const createHandler = useCallback(() => {
    // ...datum이랑 같음
    let data = createDatum ? createDatum.map((value) => value) : [];

    // 배열 없을 때는 length, 있을 때는 마지막 값의 +1 로 가져와야함
    if (`${datum.length}` == '0') {
      data.push({
        // title: `이름 ${createDatum.length + 1}`,
        title: `이름 ${datum.length + 1}`,
        cateNo: `C` + `${datum.length + 1}`.padStart(3, '0'),
      });
    } else {
      let lastCateNo = `${datum[Number(`${datum.length}`) - 1].cateNo}`;
      lastCateNo = lastCateNo.slice(-3, lastCateNo.length);

      data.push({
        title: `이름 ${datum.length + 1}`,
        cateNo: `C` + String(Number(lastCateNo) + 1).padStart(3, '0'),
      });
    }

    // setDatum(data);
    setCreateDatum(data);
    setCreateInput(`이름 ${datum.length + 1}`);
    setCreateFlag(true);
  }, [createDatum, datum]);

  // console.log(createDatum);

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
                  // onClick={() => deleteHandler(idx)}
                  onClick={() => showDetailHandler(idx)}
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
                  {' '}
                  createDatumDIV
                  {/* <input value={data.title} /> */}
                  <input
                    value={createInput}
                    // onChange={(e) => console.log(e.target.value)}
                    onChange={(e) => setCreateInput(e.target.value)}
                    // 엔터일 때 실행
                    onKeyDown={(e) =>
                      e.keyCode === 13 &&
                      dbCreateHandler(createInput, data.cateNo)
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
            카테고리 추가
          </button>
        </div>
        {/* 디테일 삽입 위치 */}
        <div
          style={{
            display: `flex`,
            width: `80%`,
            height: `100%`,
            border: `1px solid #909090`,
          }}
        >
          {createDetailDiv && (
            <div style={{ flexDirection: `row`, width: `100%` }}>
              <div
                style={{
                  display: `flex`,
                  width: `100%`,
                  height: `10%`,
                  border: `1px solid black`,
                }}
              >
                <input
                  value={createDetailDiv.title}
                  style={{ fontSize: `20px`, width: `100%` }}
                  // onKeyDown={(e) =>
                  //   e.keyCode === 13 && mdfyCateTitleHandler(createDetailDiv)
                  // }
                  // onClick={() => (mdfyCateFlag ? `readonly` : `type='text'`)}
                  // onChange={() => (mdfyCateFlag ? `readonly` : `type='text'`)}
                  onChange={(e) => {
                    mdfyCateTitleHandler({
                      cateNo: createDetailDiv.cateNo,
                      title: e.target.value,
                    });
                  }}
                  // readOnly
                ></input>
                <button style={{ width: `10%` }}>추가</button>
                <button
                  style={{ width: `10%` }}
                  onClick={() => deleteHandler(createDetailDiv.cateNo)}
                >
                  삭제{createDetailDiv.cateNo}
                </button>
              </div>
              <div style={{ height: `85%` }}> 가운데 내용 자리 </div>
              <div
                style={{
                  width: `100%`,
                  border: `1px solid black`,
                }}
              >
                <input
                  placeholder="작업 추가"
                  style={{ fontSize: `20px`, width: `100%`, height: `20%` }}
                  value={detailInput}
                  onChange={(e) => setDetailInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.keyCode === 13 &&
                    insertTodoDetailHandler(detailInput, createDetailDiv.cateNo)
                  }
                ></input>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
