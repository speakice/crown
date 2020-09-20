import React from 'react';
import { Input } from 'antd';
import {
  PlusCircleOutlined,
  EnterOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { IAim, EAimSort } from './initial';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

export enum EAimType {
  start, // 开始编辑title
  delete, // 删除
  rename, // 结束编辑title
  top, // 置顶
}

interface IPropsType {
  currentId: string;
  editId: string;
  list: Array<IAim>;
  onChange: (id: string) => void;
  handleSearch: (str: string) => void;
  onEditChange: (type: EAimType, id: string, title?: string) => void;
  onAdd: () => void;
  setShowSecondList: (Visible: boolean) => void;
}

export default (props: IPropsType) => {
  const {
    list = [],
    currentId,
    editId,
    onEditChange,
    handleSearch,
    onChange,
    onAdd,
    setShowSecondList,
  } = props;

  const handleMenuClick = (
    e: TouchEvent,
    data: { id: string; type: string },
  ) => {
    e.stopPropagation();
    const { id, type } = data;
    switch (type) {
      case 'delete':
        onEditChange(EAimType.delete, id);
        break;
      case 'top':
        onEditChange(EAimType.top, id);
        break;
      case 'rename':
        onEditChange(EAimType.start, id);
        break;
      default:
        break;
    }
  };
  const sortList = list.sort((a, b) => {
    if (!a.sort) {
      a.sort = EAimSort.normal;
    }
    if (!b.sort) {
      b.sort = EAimSort.normal;
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
          placeholder="关键字，回车搜索"
          onPressEnter={e => handleSearch((e.target as HTMLInputElement).value)}
        />
        <PlusCircleOutlined
          style={{ fontSize: 24, marginLeft: 8, color: '#c2c2c2' }}
          onClick={onAdd}
        />
      </div>
      {sortList.map(item => {
        const curStyle = item.id === currentId ? styles.active : null;
        const topClass = item.sort == EAimSort.top ? styles.top : null;
        const itemTitle =
          item.id === editId ? (
            <Input
              style={{ padding: 0, height: 25 }}
              bordered={false}
              defaultValue={item.title}
              suffix={<EnterOutlined className={styles.enter} />}
              onPressEnter={e =>
                onEditChange(
                  EAimType.rename,
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
            className={`${styles.secondItem} ${curStyle} ${topClass}`}
            key={item.id}
            onClick={() => onChange(item.id)}
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
                {item.sort === EAimSort.top ? '取消置顶' : '置顶'}
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
