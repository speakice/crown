import React, { useState } from 'react';
import moment from 'moment';
import styles from './index.less';
import { getAimState, saveAimState } from '../storage';
import shortid from 'shortid';
import SecondList, { EAimType } from './SecondList';
import PublishAim from './PublishAim';
import AimList from './AimList';
import { IAim, IAimData, newAim, EAimSort } from './initial';
import { message } from 'antd';
import EditAim from './EditAim';
import EmptyStatus from '../../../public/empty.png';
interface ITypeProps {
  showSecondList: boolean;
  setShowSecondList: (visible: boolean) => void;
}

export default (props: ITypeProps) => {
  const { showSecondList, setShowSecondList } = props;
  const [allAims, setAllAims] = useState(getAimState());
  const { currentId = '', editId, data = [] } = allAims;
  const [currentAim] = data.filter(item => item.id === currentId);
  // 修改本地todo 改变storage
  const changeAimData = (newData: IAimData) => {
    setAllAims(newData);
    saveAimState(newData);
  };
  const changeCurrentAim = (aim: IAim) => {
    const newDatas = data.filter(item => item.id !== currentId);
    newDatas.push({ ...aim, modifyTime: moment().valueOf() });
    changeAimData({ ...allAims, editId: '', data: newDatas });
  };

  const onAddAimPage = () => {
    const { data } = allAims;
    const newId = shortid.generate();
    const newItem = newAim(newId);
    data.push(newItem);
    changeAimData({ ...allAims, currentId: newId, editId: newId, data });
  };
  const addBranchTimes = (index: number) => {
    const { data } = allAims;
    const newData = data.map(item => {
      if (item.id === currentId) {
        item.currentTimes += 1;
        if (index >= 0) {
          item.branchs[index].currentTimes += 1;
        }
      }
      return item;
    });

    changeAimData({
      ...allAims,
      data: newData,
    });
  };
  const onEditChange = (type: EAimType, id: string, title?: string) => {
    if (type === EAimType.start) {
      changeAimData({ ...allAims, editId: id });
      return;
    }
    const { data } = allAims;
    if (type === EAimType.delete) {
      const newData = data.filter(item => item.id !== id);
      changeAimData({ ...allAims, data: newData });
      return;
    }
    if (type === EAimType.top) {
      const newData = data.map(item => {
        if (item.id === id) {
          item.sort =
            item.sort === EAimSort.top ? EAimSort.normal : EAimSort.top;
          item.modifyTime = moment().valueOf();
        }
        return item;
      });
      changeAimData({ ...allAims, editId: '', data: newData });
      return;
    }
    if (type === EAimType.rename) {
      if (!title) {
        message.error('标题不能为空');
        return;
      }
      const newData = data.map(item => {
        if (item.id === id) {
          item.title = title;
          item.modifyTime = moment().valueOf();
        }
        return item;
      });
      changeAimData({ ...allAims, editId: '', data: newData });
    }
  };

  console.log('currentAim', currentAim);
  return (
    <div className={styles.Aim}>
      {showSecondList && (
        <SecondList
          list={data}
          currentId={currentId}
          editId={editId}
          onEditChange={onEditChange}
          onChange={currentId => changeAimData({ ...allAims, currentId })}
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
