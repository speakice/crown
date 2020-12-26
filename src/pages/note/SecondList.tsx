import React, { useState, useEffect } from 'react';
import { Input, Popover, Menu } from 'antd';
import {
  PlusCircleOutlined,
  FolderOutlined,
  FileOutlined,
  EnterOutlined,
  FolderOpenOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import styles from './index.less';
import { INote, ENoteSort } from './initial';

export enum EFileType {
  file,
  folder,
}

export enum ENoteType {
  start, // 开始编辑title
  delete, // 删除
  rename, // 结束编辑title
  top, // 置顶
}

interface IPropsType {
  folderId: string;
  currentId: string;
  currentFolder: INote;
  editId: string;
  list: Array<INote>;
  onChange: (data: { currentId: string; folderId?: string }) => void;
  handleSearch: (str: string) => void;
  onEditChange: (
    type: ENoteType,
    id: string,
    folderId: string,
    title?: string,
  ) => void;
  onAdd: (type: EFileType, folderId?: string) => void;
  onFolderBack: () => void;
  setShowSecondList: (visible: boolean) => void;
}

export default (props: IPropsType) => {
  const {
    list = [],
    currentId,
    editId,
    folderId,
    currentFolder,
    onEditChange,
    handleSearch,
    onFolderBack,
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
        onEditChange(ENoteType.delete, id, folderId);
        break;
      case 'top':
        onEditChange(ENoteType.top, id, folderId);
        break;
      case 'rename':
        onEditChange(ENoteType.start, id, folderId);
        break;
      default:
        break;
    }
  };

  const handleItemClick = (item: INote) => {
    const { id, type } = item;
    if (id === editId) {
      return;
    }
    if (type === EFileType.folder) {
      onChange({ currentId: '', folderId: id });
      return;
    }
    if (id !== currentId) {
      onChange({ currentId: id });
    }
  };
  const sortList = list.sort((a, b) => {
    if (!a.sort) {
      a.sort = ENoteSort.normal;
    }
    if (!b.sort) {
      b.sort = ENoteSort.normal;
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
        <Popover
          mouseLeaveDelay={0.5}
          overlayStyle={{ marginLeft: 12 }}
          trigger="click"
          placement="bottomRight"
          content={
            <div className={styles.addMenu}>
              <div
                className={styles.item}
                onClick={() => {
                  onAdd(EFileType.file, folderId);
                }}
              >
                新建文件
              </div>
              {!folderId && (
                <div
                  className={styles.item}
                  onClick={() => {
                    onAdd(EFileType.folder);
                  }}
                >
                  新建文件夹
                </div>
              )}
            </div>
          }
        >
          <PlusCircleOutlined
            style={{ fontSize: 24, marginLeft: 8, color: '#c2c2c2' }}
          />
        </Popover>
      </div>
      {currentFolder && (
        <div className={styles.currentFolder}>
          <FolderOpenOutlined
            onClick={onFolderBack}
            className={styles.fileIcon}
          />
          <div className={styles.folderTitle}>{currentFolder.title}</div>
        </div>
      )}
      <div className={styles.fileList}>
        {sortList.map(item => {
          const curStyle = item.id === currentId ? styles.active : null;
          const topStyle = item.sort === ENoteSort.top ? styles.top : null;
          const itemTitle =
            item.id === editId ? (
              <Input
                style={{ height: 25, padding: 0 }}
                autoFocus={true}
                bordered={false}
                defaultValue={item.title}
                suffix={<EnterOutlined className={styles.enter} />}
                onPressEnter={e =>
                  onEditChange(
                    ENoteType.rename,
                    item.id,
                    folderId,
                    (e.target as HTMLInputElement).value,
                  )
                }
              />
            ) : (
              <div className={styles.title}>{item.title}</div>
            );
          return (
            <div
              className={`${styles.secondItem} ${curStyle} ${topStyle}`}
              key={item.id}
              onClick={() => handleItemClick(item)}
            >
              {item.type === EFileType.folder ? (
                <FolderOutlined className={styles.fileIcon} />
              ) : (
                <FileOutlined className={styles.fileIcon} />
              )}
              <ContextMenuTrigger id={item.id}>
                <div className={styles.item}>
                  {itemTitle}
                  {item.type === EFileType.file && item.desc && (
                    <div className={styles.desc}>{item.desc}</div>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenu id={item.id}>
                <MenuItem
                  data={{ id: item.id, type: 'top' }}
                  onClick={handleMenuClick}
                >
                  {item.sort === ENoteSort.top ? '取消置顶' : '置顶'}
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
      </div>
      <div className={styles.close}>
        <ArrowLeftOutlined onClick={() => setShowSecondList(false)} />
      </div>
    </div>
  );
};
