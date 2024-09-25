import { useCallback, useState } from 'react';

// cate TABLE
type TData = {
  cateNo: string;
  title: string;
};

// Task(detail) TABLE
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
  // 가상DB
  const [datum, setDatum] = useState<TData[]>([]); // 카테고리 DB
  const [detailTable, setDetailTable] = useState<DetailVO[]>([]); // TASK DB(DEtail DB)
  const [selCateDetail, setSelCateDetail] = useState<DetailVO[]>([]); // 선택된 카테고리에 해당하는 Task만 select

  const [createDatum, setCreateDatum] = useState<TData[]>([]); // 엔터를 누르기 전까지는 input
  const [createInput, setCreateInput] = useState(''); // createInput 값 변경용
  const [createFlag, setCreateFlag] = useState(false); // false : 추가버튼 보임, true : 안보임
  const [createDetailDiv, setCreateDetailDiv] = useState<TData | null>(null);

  // task
  const [taskInput, setTaskInput] = useState(''); // 작업추가용 값
  const [showTaskDetailFlag, setShowTaskDetailFlag] = useState(false); // true : 보임 / false : 안보임
  const [createTaskDetailDiv, setCreateTaskDetailDiv] =
    useState<DetailVO | null>(null);

  // task 삭제
  const deleteTaskHandler = useCallback(
    (detailNo: String, orderNo: number) => {
      let data = detailTable ? detailTable.map((value) => value) : [];
      let selData = selCateDetail ? selCateDetail.map((value) => value) : [];

      // taskDB 삭제
      let dataDelIndex = data.findIndex(
        (taskItem) =>
          taskItem.detailNo === detailNo && taskItem.orderNo === orderNo
      );
      data.splice(dataDelIndex, 1);

      // selectedTaskDB 삭제
      let deleteIndex = selData.findIndex(
        (taskItem) =>
          taskItem.detailNo === detailNo && taskItem.orderNo == orderNo
      );
      selData.splice(deleteIndex, 1);

      setDetailTable(data);
      setSelCateDetail(selData);
      setCreateTaskDetailDiv(null);
    },
    [detailTable]
  );

  // task 내용 수정
  const mdfyTaskContentHandler = useCallback(
    (detailNo: string, orderNo: number, content: string) => {
      let data = detailTable ? detailTable.map((value) => value) : [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].detailNo === detailNo && data[i].orderNo === orderNo) {
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
      setCreateTaskDetailDiv(null);

      console.log('내가고른 task 정보 >> ', detailNo, ' , ', orderNo);
      let data = detailTable ? detailTable.map((value) => value) : [];

      const detailVO =
        data.find(
          (taskItem) =>
            taskItem.detailNo === detailNo && taskItem.orderNo === orderNo
        ) || null;
      setCreateTaskDetailDiv(detailVO);
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
        if (data[i].cateNo === cateNo) {
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
      let detailNoStr = '';

      // 배열 없을 때는 length, 있을 때는 마지막 값의 +1 로 가져와야함
      if (`${detailTable.length}` === '0') {
        detailNoStr = `D` + `${detailTable.length + 1}`.padStart(3, '0');
      } else {
        let lastDetailNo = `${
          detailTable[Number(`${detailTable.length}`) - 1].detailNo
        }`;
        lastDetailNo = lastDetailNo.slice(-3, lastDetailNo.length);
        detailNoStr = `D` + String(Number(lastDetailNo) + 1).padStart(3, '0');
      }

      // orderNo는 0번부터 시작하는데 cateNo로 등록 안되어있으면 0을 있으면 등록된 orderNo를 배열에 담ㅇ ㅏmax값 구하기.
      let orderNoInt = 0;
      // 배열 없을 때는 length, 있을 때는 마지막 값의 +1 로 가져와야함
      if (`${detailTable.length}` === '0') {
        orderNoInt = 0;
      } else {
        console.log('arr담기 전 db확인>>', data);
        let cateExist = data.some((taskItem) => taskItem.cateNo === cateNo);
        let orderNoArr = [];

        // cateNo 해당하는 task 데이터 있는 경우
        if (cateExist == true) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].cateNo === cateNo) {
              orderNoArr.push(data[i].orderNo);
            }
          }
          orderNoInt = Math.max(...orderNoArr) + 1; // max + 1
        } else {
          orderNoInt = 0;
        }
      }

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
        if (data[i].cateNo === detailVO.cateNo) {
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
        let taskData = detailTable ? detailTable.map((value) => value) : [];

        for (let i = 0; i < data.length; i++) {
          const arrCateNo = data[i].cateNo;
          if (arrCateNo === cateNo) {
            data.splice(i, 1);
          }
        }

        // 삭제할 cateNo에 해당하는 TaskData 삭제처리 240925
        if (taskData != null) {
          let newTaskData = taskData.filter((task) => task.cateNo != cateNo);
          setDetailTable(newTaskData);
        }

        setDatum(data);
        setCreateDetailDiv(null); // 내용 div 삭제
      }
    },
    [datum, detailTable]
  );

  const showTaskHandler = useCallback(
    (idx: number) => {
      console.log('showTaskHandler 클릭 >> ', idx);
      // let data = datum ? datum.map((value) => value) : [];
      let data = datum[idx];

      // 선택된 db 초기화
      setSelCateDetail([]);

      setCreateDetailDiv(data);
      selectTaskHandler(data.cateNo);
      setCreateTaskDetailDiv(null);
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
  );

  // 생성
  const createHandler = useCallback(() => {
    // ...datum이랑 같음
    let data = createDatum ? createDatum.map((value) => value) : [];

    // 배열 없을 때는 length, 있을 때는 마지막 값의 +1 로 가져와야함
    if (`${datum.length}` === '0') {
      data.push({
        // title: `이름 ${datum.length + 1}`,
        title: `제목 없는 목록`,
        cateNo: `C` + `${datum.length + 1}`.padStart(3, '0'),
      });
    } else {
      let lastCateNo = `${datum[Number(`${datum.length}`) - 1].cateNo}`;
      lastCateNo = lastCateNo.slice(-3, lastCateNo.length);

      data.push({
        // title: `이름 ${datum.length + 1}`,
        title: `제목 없는 목록`,
        cateNo: `C` + String(Number(lastCateNo) + 1).padStart(3, '0'),
      });
    }

    // setDatum(data);
    setCreateDatum(data);
    // setCreateInput(`이름 ${datum.length + 1}`);
    setCreateInput(`제목 없는 목록`);
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
          <strong>TODO LIST</strong>
          <div
            style={{
              height: `calc(100% - 50px - 10px)`,
              display: `flex`,
              flexDirection: `column`,

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
                    textAlign: `left`,
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
                  {/* <input value={data.title} /> */}
                  <input
                    value={createInput}
                    onChange={(e) => setCreateInput(e.target.value)}
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
                <button
                  style={{ width: `10%` }}
                  onClick={() => deleteHandler(createDetailDiv.cateNo)}
                >
                  삭제
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
                      {/* 카테고리 삭제 시 detailDB에서도 cateNo해당 데이터 삭제(ㅇ)
                          div클릭 시 상세 div 오른쪽에서 등장 (ㅇ)
                          오른쪽에서 내용 수정 (ㅇ)
                          오른쪽에서 삭제 (ㅇ)

                          checkbox 상태 변화 시 해당 cateNo YN -> Y로 변경 
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
              display: showTaskDetailFlag ? `flex` : `none`,
              justifyContent: `space-between`,
            }}
          >
            <div
              style={{
                display: `flex`,
                flexDirection: `column`,
                height: `10%`,
              }}
            >
              <button
                style={{ width: `30px`, height: `30px`, alignSelf: 'flex-end' }}
                onClick={() => setCreateTaskDetailDiv(null)}
              >
                x
              </button>
              <div
                style={{
                  border: `1px solid #909090`,
                  width: `100%`,
                  height: `100px`,
                }}
              >
                <input type="checkbox"></input>
                <input
                  value={createTaskDetailDiv.content}
                  style={{ fontSize: `25px` }}
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
            </div>
            <div style={{ display: `flex` }}>
              <span>
                {' '}
                {createTaskDetailDiv.regDate.toLocaleString()}에 생성됨
              </span>
              &nbsp;
              <button
                style={{ marginLeft: `auto`, alignSelf: 'flex-end' }}
                onClick={() =>
                  deleteTaskHandler(
                    createTaskDetailDiv.detailNo,
                    createTaskDetailDiv.orderNo
                  )
                }
              >
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
