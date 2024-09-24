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
  startDt: Date | null;
  endDt: Date | null;
  regDate: Date;
  checkYN: string; // default : N
};

function App() {
  // 타입 설정 및 배열인 경우에는 Tdata[] 이라고 명시해줌
  // 가상DB
  const [datum, setDatum] = useState<TData[]>([]); // 카테고리 DB
  const [detailTable, setDetailTable] = useState<DetailVO[]>([]); // 작업 DB DB
  const [selCateDetail, setSelCateDetail] = useState<DetailVO[]>([]); // 선택된 카테고리에 해당하는 작업만 select

  const [createDatum, setCreateDatum] = useState<TData[]>([]); // 엔터를 누르기 전까지는 input
  const [createInput, setCreateInput] = useState(''); // createInput 값 변경용
  const [createFlag, setCreateFlag] = useState(false); // false : 추가버튼 보임, true : 안보임
  const [createDetailDiv, setCreateDetailDiv] = useState<TData | null>(null);

  // task
  const [taskInput, setTaskInput] = useState(''); // 작업추가용 값

  const [detailInput, setDetailInput] = useState(''); // detail수정용 값
  const [showTaskDetailFlag, setShowTaskDetailFlag] = useState(false); // true : 보임 / false : 안보임
  const [createTaskDetailDiv, setCreateTaskDetailDiv] =
    useState<DetailVO | null>(null);

  // 작업내용 수정
  const mdfyTaskContentHandler = useCallback(
    (detailNo: string, orderNo: number, content: string) => {
      let data = detailTable ? detailTable.map((value) => value) : [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].detailNo == detailNo && data[i].orderNo == orderNo) {
          data[i].content = content;
        }
      }

      setDetailTable(data);
      // setCreateDetailDiv(data);
    },
    [detailTable]
  );

  const showDetailHandler = useCallback(
    (detailNo: string, orderNo: number) => {
      // 해당 detailNo와 orderNo가 매칭하는 데이터 골라서 상세에 넣기

      setCreateTaskDetailDiv(null);

      console.log('내가고른 task 정보 >> ', detailNo, ' , ', orderNo);
      let data = detailTable ? detailTable.map((value) => value) : [];
      // let taskDetailVO = [];

      for (let i = 0; i < data.length; i++) {
        if (
          detailTable[i].detailNo == detailNo &&
          detailTable[i].orderNo == orderNo
        ) {
          // taskDetailVO.push(detailTable[i]);
          setCreateTaskDetailDiv(detailTable[i]);
        }
      }

      console.log('누른 detail상세 확인 >> ', createTaskDetailDiv);

      // setDetailInput(taskDetailVO.)// 여기에 제목만 넣기

      setShowTaskDetailFlag(true);
    },
    [detailTable, createTaskDetailDiv]
  );

  // 선택된 데이터만 DB에 저장
  const selectTaskHandler = useCallback(
    (cateNo: string) => {
      let data = detailTable ? detailTable.map((value) => value) : [];
      let selectedData = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].cateNo == cateNo) {
          selectedData.push(data[i]);
        }
      }
      setSelCateDetail(selectedData);
    },
    [selCateDetail]
  );

  // todo 내용 Insert
  const insertTodoDetailHandler = useCallback(
    (content: string, cateNo: string) => {
      let data = detailTable ? detailTable.map((value) => value) : [];
      let selData = selCateDetail ? selCateDetail.map((value) => value) : [];

      console.log('작업추가 내용 확인 >>', content, 'cateNo >> ', cateNo);

      // 현재 날짜와 시간을 가져오기
      let currentDate = new Date();
      console.log('지금 날짜 >> ', currentDate);

      let detailNoStr = '';

      // 배열 없을 때는 length, 있을 때는 마지막 값의 +1 로 가져와야함
      if (`${detailTable.length}` == '0') {
        detailNoStr = `D` + `${datum.length + 1}`.padStart(3, '0');
      } else {
        let lastDetailNo = `${
          detailTable[Number(`${detailTable.length}`) - 1].detailNo
        }`;
        lastDetailNo = lastDetailNo.slice(-3, lastDetailNo.length);
        detailNoStr = `D` + String(Number(lastDetailNo) + 1).padStart(3, '0');
      }

      console.log('detailNoStr 확인 >> ', detailNoStr);

      // orderNo는 0번부터 시작하는데 cateNo로 등록 안되어있으면 0을 있으면 등록된 orderNo를 배열에 담ㅇ ㅏmax값 구하기.
      let orderNoInt = 0;
      // 배열 없을 때는 length, 있을 때는 마지막 값의 +1 로 가져와야함
      if (`${detailTable.length}` == '0') {
        orderNoInt = 0;
      } else {
        // cateNo 해당 orderNo만 담기
        let cateNoArr = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].cateNo == cateNo) {
            cateNoArr.push(data[i].orderNo);
          }
        }
        orderNoInt = Math.max(...cateNoArr) + 1; // max + 1
      }
      console.log('orderNoInt 확인 >> ', orderNoInt);

      if (content != null && content != '') {
        const newTask: DetailVO = {
          detailNo: detailNoStr,
          cateNo: cateNo,
          orderNo: orderNoInt,
          content: content,
          startDt: null,
          endDt: null,
          regDate: currentDate,
          checkYN: 'N',
        };

        data.push(newTask);
        selData.push(newTask);

        /*
          1. DetailDB
          2. 해당 cateNo에 해당하는 detail만 select DB 필요
          3. insert시 detailDB랑 해당 cateNo에 해당하는 select DB에도 값 insert 
        */
      }

      console.log('detail DB data 객체 확인 >> ', data);

      setTaskInput('');
      setDetailTable(data);
      setSelCateDetail(selData);
    },
    [detailTable, selCateDetail]
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

  const showTaskHandler = useCallback(
    (idx: number) => {
      console.log('showTaskHandler 클릭 >> ', idx);
      // let data = datum ? datum.map((value) => value) : [];
      let data = datum[idx];

      // 선택된 db 초기화
      setSelCateDetail([]);
      console.log(
        '왼쪾 카테고리 div 선택 시 초기화 됏느지 확인 >> ',
        selCateDetail
      );

      setCreateDetailDiv(data);
      selectTaskHandler(data.cateNo);
    },
    [datum, selCateDetail]
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
                  onClick={() => showTaskHandler(idx)}
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
                  onChange={(e) => {
                    mdfyCateTitleHandler({
                      cateNo: createDetailDiv.cateNo,
                      title: e.target.value,
                    });
                  }}
                ></input>
                <button style={{ width: `10%` }}>추가</button>
                <button
                  style={{ width: `10%` }}
                  onClick={() => deleteHandler(createDetailDiv.cateNo)}
                >
                  삭제{createDetailDiv.cateNo}
                </button>
              </div>
              <div style={{ height: `85%` }}>
                {' '}
                <span>[미완료]</span>
                {selCateDetail.map((data, idx) => {
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
                      onClick={() =>
                        showDetailHandler(data.detailNo, data.orderNo)
                      }
                    >
                      {/* 카테고리 삭제 시 detailDB에서도 cateNo해당 데이터 삭제
                          checkbox 상태 변화 시 해당 cateNo YN -> Y로 변경 
                          div클릭 시 상세 div 오른쪽에서 등장 (ㅇ)
                          오른쪽에서 내용 수정 
                          오른쪽에서 삭제

                          checkbox 변화에 따라 아래쪽 완료 div로 이동 풀면 -> 다시 위로 이동

                      */}
                      <input type="checkbox"></input>
                      {data.content}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  width: `100%`,
                  border: `1px solid black`,
                }}
              >
                <input
                  placeholder="작업 추가"
                  style={{ fontSize: `20px`, width: `100%`, height: `20%` }}
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.keyCode === 13 &&
                    insertTodoDetailHandler(taskInput, createDetailDiv.cateNo)
                  }
                ></input>
              </div>
            </div>
          )}
        </div>

        {createTaskDetailDiv && (
          <div
            style={{
              flexDirection: `column`,
              width: `30%`,
              height: `100%`,
              border: `1px solid #909090`,
              padding: `10px`,
              display: showTaskDetailFlag ? `initial` : `none`,
            }}
          >
            마지막 상세 DIV
            <div
              style={{
                display: `flex`,
                flexDirection: `column`,
                border: `1px solid #909090`,
                height: `10%`,
              }}
            >
              <button style={{ width: `30px`, height: `30px` }}>x</button>
              <input
                // value={detailInput}
                value={createTaskDetailDiv.content}
                style={{ fontSize: `20px` }}
                onChange={(e) => {
                  mdfyTaskContentHandler(
                    createTaskDetailDiv.detailNo,
                    createTaskDetailDiv.orderNo,
                    e.target.value
                  );
                }}
                /* 0926 이 부분 소스 확인 및 정리하고 삭제 등등 진행 */
              />
            </div>
            <div>2번째</div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
