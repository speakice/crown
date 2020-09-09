import shortid from 'shortid';
import moment from 'moment';
import { EFileType } from './SecondList';

export interface INote {
  id: string;
  title: string;
  createTime: number;
  modifyTime: number;
  sort: ENoteSort;
  type: EFileType;
  folder?: Array<INote>; //文件夹内部列表
  desc: string;
  content: string;
}

export enum ENoteSort {
  top = 1,
  normal = 2,
}

export const newNote = () => {
  const newId = shortid.generate();
  const curTime = moment().valueOf();
  return {
    id: newId,
    title: moment().format('YYYYMMDD') + '日志',
    createTime: curTime,
    modifyTime: curTime,
    sort: ENoteSort.normal,
    desc: '',
    content: '',
  };
};

export const initNote = () => {
  const newId = shortid.generate();
  return {
    folderId: '',
    currentId: newId,
    editId: '',
    data: [
      {
        ...newNote(),
        id: newId,
        type: EFileType.file,
      },
    ],
  };
};

export interface INoteData {
  currentId: string;
  editId: string;
  folderId: string;
  data: Array<INote>;
}
