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

export const newNote = (momentFn: moment.Moment, id: string) => {
  const curTime = momentFn.valueOf();
  return {
    id,
    title: momentFn.format('YYYYMMDD') + '日志',
    createTime: curTime,
    modifyTime: curTime,
    sort: ENoteSort.normal,
    desc: '',
    content: '',
  };
};

export const initNote = (momentFn: moment.Moment) => {
  const newId = shortid.generate();
  return {
    folderId: '',
    currentId: newId,
    editId: '',
    data: [
      {
        ...newNote(momentFn, newId),
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
