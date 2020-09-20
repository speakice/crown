import React from 'react';
import { useIdb } from 'react-use-idb';
import moment from 'moment';
import VEditor from '../components/VEditor';
import SecondList, { ENoteType, EFileType } from './SecondList';
import shortid from 'shortid';
import styles from './index.less';
import { message } from 'antd';
import { newNote, INote, ENoteSort, initNote } from './initial';
import EmptyStatus from '../../../public/empty.png';

interface ITypeProps {
  showSecondList: boolean;
  setShowSecondList: (visible: boolean) => void;
}
export default (props: ITypeProps) => {
  const { showSecondList, setShowSecondList } = props;
  const [allNotes, setAllNotes] = useIdb('note', initNote(moment()));
  const { currentId = '', editId, data = [], folderId = '' } = allNotes;
  let currentList = [...data];
  const [currentFolder] = data.filter((item: INote) => item.id === folderId);
  if (currentFolder) {
    currentList = currentFolder.folder || [];
  }
  const [currentNote] = currentList.filter(
    (item: INote) => item.id === currentId,
  );

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
    setAllNotes({ ...allNotes, data: newDatas });
  };

  const onFolderBack = () => {
    setAllNotes({ ...allNotes, currentId: '', folderId: '' });
  };

  const onAddNotePage = (type: EFileType, folderId?: string) => {
    const newData = [...data];
    const newId = shortid.generate();
    if (!folderId) {
      const folder = type === EFileType.folder ? { folder: [] } : {};
      newData.push({ ...newNote(moment(), newId), type, ...folder });
    } else {
      newData.map(item => {
        if (item.id === folderId) {
          item.folder?.push({ ...newNote(moment(), newId), type });
        }
        return item;
      });
    }
    const currentId = type === EFileType.folder ? {} : { currentId: newId };
    setAllNotes({ ...allNotes, ...currentId, editId: newId, data: newData });
  };

  const onEditChange = (
    type: ENoteType,
    id: string,
    folderId: string,
    title?: string,
  ) => {
    if (type === ENoteType.start) {
      setAllNotes({ ...allNotes, editId: id });
      return;
    }
    if (type === ENoteType.delete) {
      let newData = [...data];
      if (!folderId) {
        newData = newData.filter((item: INote) => item.id !== id);
      } else {
        newData = newData.map(item => {
          if (item.id === folderId) {
            item.folder = item.folder?.filter((note: INote) => note.id !== id);
            item.modifyTime = moment().valueOf();
          }
          return item;
        });
      }
      setAllNotes({ ...allNotes, data: newData });
      return;
    }
    if (type === ENoteType.top) {
      console.log('noteTop', folderId, id);
      const newData = data.map((item: INote) => {
        if (!folderId) {
          if (item.id === id) {
            item.sort =
              item.sort === ENoteSort.top ? ENoteSort.normal : ENoteSort.top;
            item.modifyTime = moment().valueOf();
          }
        } else {
          if (item.id === folderId) {
            item.folder = item.folder?.map((note: INote) => {
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
      setAllNotes({ ...allNotes, editId: '', data: newData });
      return;
    }
    if (type === ENoteType.rename) {
      if (!title) {
        message.error('标题不能为空');
        return;
      }
      const newData = data.map((item: INote) => {
        if (!folderId) {
          if (item.id === id) {
            item.title = title;
            item.modifyTime = moment().valueOf();
          }
        } else {
          if (item.id === folderId) {
            item.folder = item.folder?.map((note: INote) => {
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
      setAllNotes({ ...allNotes, editId: '', data: newData });
    }
  };
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
          onChange={data => setAllNotes({ ...allNotes, ...data, editId: '' })}
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
