import React, { useState } from 'react';
import moment from 'moment';
import VEditor from '../components/VEditor';
import SecondList, { ENoteType, EFileType } from './SecondList';
import shortid from 'shortid';
import styles from './index.less';
import { saveNoteState, getNoteState } from '../storage';
import { message } from 'antd';
import { newNote, INote, INoteData, ENoteSort } from './initial';
import EmptyStatus from '../../../public/empty.png';
interface ITypeProps {
  showSecondList: boolean;
  setShowSecondList: (visible: boolean) => void;
}
export default (props: ITypeProps) => {
  const { showSecondList, setShowSecondList } = props;
  const [allNotes, setAllNotes] = useState(getNoteState());
  const { currentId = '', editId, data = [], folderId = '' } = allNotes;
  let currentList = [...data];
  const [currentFolder] = data.filter(item => item.id === folderId);
  if (currentFolder) {
    currentList = currentFolder.folder || [];
  }
  const [currentNote] = currentList.filter(
    (item: INote) => item.id === currentId,
  );
  // 修改本地todo 改变storage
  const changeNoteData = (newData: INoteData) => {
    console.log('changeNoteData', newData);
    setAllNotes(newData);
    saveNoteState(newData);
  };

  const getDesc = (val: string = '') => {
    const clearVal = val
      .replace(/#*.*#/g, '')
      .replace(/`*.*`/g, '')
      .replace(/-/g, '')
      .replace(/>/g, '')
      .replace(/\ +/g, '')
      .replace(/[ ]/g, '')
      .replace(/[\r\n]/g, '')
      .replace(/[^a-z0-9\u4e00-\u9fa5]/, '');
    if (clearVal.length < 14) {
      return clearVal;
    }
    return clearVal.substring(0, 14);
  };
  const changeCurrentNote = (val: string) => {
    const newDatas = data.map((item: INote) => {
      if (!folderId) {
        if (item.id === currentId) {
          item.content = val;
          item.desc = getDesc(val.substring(0, 50));
          item.modifyTime = moment().valueOf();
        }
      } else {
        if (item.id === folderId) {
          item.folder = item.folder?.map(note => {
            if (note.id === currentId) {
              note.content = val;
              note.desc = getDesc(val.substring(0, 50));
              note.modifyTime = moment().valueOf();
              item.modifyTime = moment().valueOf(); // item的修改时间也要同步更新
            }
            return note;
          });
        }
      }

      return item;
    });
    changeNoteData({ ...allNotes, data: newDatas });
  };

  const onFolderBack = () => {
    changeNoteData({ ...allNotes, currentId: '', folderId: '' });
  };

  const onAddNotePage = (type: EFileType, folderId?: string) => {
    const newData = [...data];
    const newId = shortid.generate();
    if (!folderId) {
      const folder = type === EFileType.folder ? { folder: [] } : {};
      newData.push({ ...newNote(), type, ...folder, id: newId });
    } else {
      newData.map(item => {
        if (item.id === folderId) {
          item.folder?.push({ ...newNote(), type, id: newId });
        }
        return item;
      });
    }
    const currentId = type === EFileType.folder ? {} : { currentId: newId };
    changeNoteData({ ...allNotes, ...currentId, editId: newId, data: newData });
  };

  const onEditChange = (
    type: ENoteType,
    id: string,
    folderId: string,
    title?: string,
  ) => {
    if (type === ENoteType.start) {
      changeNoteData({ ...allNotes, editId: id });
      return;
    }
    if (type === ENoteType.delete) {
      let newData = [...data];
      if (!folderId) {
        newData = newData.filter(item => item.id !== id);
      } else {
        newData = newData.map(item => {
          if (item.id === folderId) {
            item.folder = item.folder?.filter(note => note.id !== id);
            item.modifyTime = moment().valueOf();
          }
          return item;
        });
      }
      changeNoteData({ ...allNotes, data: newData });
      return;
    }
    if (type === ENoteType.top) {
      console.log('noteTop', folderId, id);
      const newData = data.map(item => {
        if (!folderId) {
          if (item.id === id) {
            item.sort =
              item.sort === ENoteSort.top ? ENoteSort.normal : ENoteSort.top;
            item.modifyTime = moment().valueOf();
          }
        } else {
          if (item.id === folderId) {
            item.folder = item.folder?.map(note => {
              if (note.id === id) {
                note.sort =
                  note.sort === ENoteSort.top
                    ? ENoteSort.normal
                    : ENoteSort.top;
                note.modifyTime = moment().valueOf();
                item.modifyTime = moment().valueOf();
              }
              return note;
            });
          }
        }
        return item;
      });
      console.log('noteTop', ENoteSort.top, folderId, id, newData);
      changeNoteData({ ...allNotes, editId: '', data: newData });
      return;
    }
    if (type === ENoteType.rename) {
      if (!title) {
        message.error('标题不能为空');
        return;
      }
      const newData = data.map(item => {
        if (!folderId) {
          if (item.id === id) {
            item.title = title;
            item.modifyTime = moment().valueOf();
          }
        } else {
          if (item.id === folderId) {
            item.folder = item.folder?.map(note => {
              if (note.id === id) {
                note.title = title;
                note.modifyTime = moment().valueOf();
                item.modifyTime = moment().valueOf();
              }
              return note;
            });
          }
        }
        return item;
      });
      changeNoteData({ ...allNotes, editId: '', data: newData });
    }
  };

  console.log('currentNote', currentNote, currentList);
  return (
    <div className={styles.Note}>
      {showSecondList && (
        <SecondList
          list={currentList}
          folderId={folderId}
          currentId={currentId}
          currentFolder={currentFolder}
          onFolderBack={onFolderBack}
          editId={editId}
          onEditChange={onEditChange}
          onChange={data =>
            changeNoteData({ ...allNotes, ...data, editId: '' })
          }
          onAdd={onAddNotePage}
          setShowSecondList={setShowSecondList}
        />
      )}
      {currentNote ? (
        <VEditor onSave={changeCurrentNote} data={currentNote} />
      ) : (
        <div className={styles.empty}>
          <img src={EmptyStatus} alt="没有数据" />
          <span className={styles.emptyWord}>空空如也</span>
        </div>
      )}
    </div>
  );
};
