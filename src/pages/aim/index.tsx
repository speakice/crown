import React from 'react';
import { useIdb } from 'react-use-idb';
import moment from 'moment';
import styles from './index.less';
import shortid from 'shortid';
import SecondList, { EAimType } from './SecondList';
import AimList from './AimList';
import { IAim, newAim, EAimSort, initAim } from './initial';
import { message } from 'antd';
import EditAim from './EditAim';
import EmptyStatus from '../../../public/empty.png';
interface ITypeProps {
  showSecondList: boolean;
  setShowSecondList: (visible: boolean) => void;
}

export default (props: ITypeProps) => {
  const { showSecondList, setShowSecondList } = props;
  const [allAims, setAllAims] = useIdb('aim', initAim(moment()));
  const { currentId = '', editId, data = [] } = allAims;
  const [currentAim] = data.filter((item: IAim) => item.id === currentId);

  const changeCurrentAim = (aim: IAim) => {
    const newDatas = data.filter((item: IAim) => item.id !== currentId);
    newDatas.push({ ...aim, modifyTime: moment().valueOf() });
    setAllAims({ ...allAims, editId: '', data: newDatas });
  };

  const onAddAimPage = () => {
    const { data } = allAims;
    const newId = shortid.generate();
    data.push(newAim(moment(), newId));
    setAllAims({ ...allAims, currentId: newId, editId: newId, data });
  };
  const addBranchTimes = (index: number) => {
    const { data } = allAims;
    const newData = data.map((item: IAim) => {
      if (item.id === currentId) {
        item.currentTimes += 1;
        if (index >= 0) {
          item.branchs[index].currentTimes += 1;
        }
      }
      return item;
    });

    setAllAims({
      ...allAims,
      data: newData,
    });
  };
  const onEditChange = (type: EAimType, id: string, title?: string) => {
    if (type === EAimType.start) {
      setAllAims({ ...allAims, editId: id });
      return;
    }
    const { data } = allAims;
    if (type === EAimType.delete) {
      const newData = data.filter((item: IAim) => item.id !== id);
      setAllAims({ ...allAims, data: newData });
      return;
    }
    if (type === EAimType.top) {
      const newData = data.map((item: IAim) => {
        if (item.id === id) {
          item.sort =
            item.sort === EAimSort.top ? EAimSort.normal : EAimSort.top;
          item.modifyTime = moment().valueOf();
        }
        return item;
      });
      setAllAims({ ...allAims, editId: '', data: newData });
      return;
    }
    if (type === EAimType.rename) {
      if (!title) {
        message.error('标题不能为空');
        return;
      }
      const newData = data.map((item: IAim) => {
        if (item.id === id) {
          item.title = title;
          item.modifyTime = moment().valueOf();
        }
        return item;
      });
      setAllAims({ ...allAims, editId: '', data: newData });
    }
  };

  return (
    <div className={styles.Aim}>
      {showSecondList && (
        <SecondList
          list={data}
          currentId={currentId}
          editId={editId}
          onEditChange={onEditChange}
          onChange={currentId => setAllAims({ ...allAims, currentId })}
          onAdd={onAddAimPage}
          setShowSecondList={setShowSecondList}
        />
      )}
      {currentAim ? (
        <div className={styles.content}>
          <EditAim
            editId={editId}
            data={currentAim}
            onEditChange={onEditChange}
            onSubmit={changeCurrentAim}
          />
          <AimList data={currentAim} addBranchTimes={addBranchTimes} />
        </div>
      ) : (
        <div className={styles.empty}>
          <img src={EmptyStatus} alt="没有数据" />
          <span className={styles.emptyWord}>空空如也</span>
        </div>
      )}
    </div>
  );
};
