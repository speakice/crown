import React, { useState } from 'react';
import { Input, message } from 'antd';
import {
  PlusCircleOutlined,
  EnterOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { ITodo, ESort } from './initial';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { saveTodoState, saveNoteState, saveAimState } from '../storage';

export enum ETodoType {
  start, // 开始编辑title
  delete, // 删除
  rename, // 结束编辑title
  top, // 置顶
}

interface IPropsType {
  currentId: string;
  editId: string;
  list: Array<ITodo>;
  onChange: (id: string) => void;
  onEditChange: (type: ETodoType, id: string, title?: string) => void;
  onAdd: () => void;
  setShowSecondList: (visible: boolean) => void;
}

export default (props: IPropsType) => {
  const [searchInput, setSearchInput] = useState('');
  const {
    list = [],
    currentId,
    editId,
    onEditChange,
    onChange,
    onAdd,
    setShowSecondList,
  } = props;
  const handleSearch = (val: string = '') => {
    if (!val) return;
    const jsonObj = JSON.parse(val);
    if (jsonObj.todo) {
      saveTodoState(jsonObj.todo);
    }
    if (jsonObj.note) {
      saveNoteState(jsonObj.note);
    }
    if (jsonObj.aim) {
      saveAimState(jsonObj.aim);
    }
    setSearchInput('');
  };
  const handleMenuClick = (
    e: TouchEvent,
    data: { id: string; type: string },
  ) => {
    e.stopPropagation();
    const { id, type } = data;
    switch (type) {
      case 'delete':
        onEditChange(ETodoType.delete, id);
        break;
      case 'top':
        onEditChange(ETodoType.top, id);
        break;
      case 'rename':
        onEditChange(ETodoType.start, id);
        break;
      default:
        break;
    }
  };
  const sortList = list.sort((a, b) => {
    if (!a.sort) {
      a.sort = ESort.normal;
    }
    if (!b.sort) {
      b.sort = ESort.normal;
    }
    if (a.sort === b.sort) {
      return b.modifyTime - a.modifyTime; // 时间倒序
    }
    return a.sort - b.sort;
  });
  return (
    <div className={styles.SecondList}>
      <div className={styles.search}>
        <Input
          value={searchInput}
          placeholder="关键字，回车搜索"
          onChange={e => setSearchInput(e.target.value)}
          onPressEnter={e => handleSearch((e.target as HTMLInputElement).value)}
        />
        <PlusCircleOutlined
          style={{ fontSize: 24, marginLeft: 8, color: '#c2c2c2' }}
          onClick={onAdd}
        />
      </div>
      {sortList.map(item => {
        const activeClass = item.id === currentId ? styles.active : null;
        const topClass = item.sort == ESort.top ? styles.top : null;
        const itemTitle =
          item.id === editId ? (
            <Input
              bordered={false}
              style={{ padding: 0 }}
              defaultValue={item.title}
              suffix={<EnterOutlined className={styles.enter} />}
              onPressEnter={e =>
                onEditChange(
                  ETodoType.rename,
                  editId,
                  (e.target as HTMLInputElement).value,
                )
              }
            />
          ) : (
            <div className={styles.title}>{item.title}</div>
          );
        return (
          <div
            className={`${styles.secondItem} ${activeClass} ${topClass}`}
            key={item.id}
            onClick={() => {
              if (currentId !== item.id) onChange(item.id);
            }}
          >
            <ContextMenuTrigger id={item.id}>
              <div className={styles.item}>
                {itemTitle}
                {item.desc && <div className={styles.desc}>{item.desc}</div>}
              </div>
            </ContextMenuTrigger>
            <ContextMenu id={item.id}>
              <MenuItem
                data={{ id: item.id, type: 'top' }}
                onClick={handleMenuClick}
              >
                {item.sort === ESort.top?'取消置顶':'置顶'}
              </MenuItem>
              <MenuItem
                data={{ id: item.id, type: 'rename' }}
                onClick={handleMenuClick}
              >
                重命名
              </MenuItem>
              <MenuItem
                data={{ id: item.id, type: 'delete' }}
                onClick={handleMenuClick}
              >
                删除
              </MenuItem>
            </ContextMenu>
          </div>
        );
      })}
      <div className={styles.close}>
        <ArrowLeftOutlined onClick={() => setShowSecondList(false)} />
      </div>
    </div>
  );
};
