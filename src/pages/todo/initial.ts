import moment from 'moment';
import shortid from 'shortid';

export enum ERepeat {
  once,
  everyday,
  weekly,
}

export enum ERate {
  zero,
  one,
  two,
  three,
  four,
}

export enum EStatus {
  todo,
  doing,
  done,
}

export interface ITask {
  id: string;
  status: EStatus;
  content: string;
  rate: ERate;
  repeat?: number;
}

export interface IColumn {
  id: string;
  name: string;
  title?: string;
  tasks: Array<ITask>;
}

export interface ITodo {
  id: string;
  title: string;
  desc?: string;
  columns: Array<IColumn>;
  createTime: number;
  modifyTime: number;
  sort: number;
}

export interface ITodoData {
  currentId: string;
  editId: string;
  data: Array<ITodo>;
}

export enum ESort {
  top = 1,
  normal = 2,
}

export const newTodo = () => {
  const curTime = moment().valueOf();
  return {
    id: shortid.generate(),
    title: moment().format('YYYYMMDD'),
    createTime: curTime,
    modifyTime: curTime,
    sort: ESort.normal,
    columns: [
      {
        id: 'column-todo',
        name: '代办',
        tasks: [],
      },
      {
        id: 'column-inprogress',
        name: '进行中',
        tasks: [],
      },
      {
        id: 'column-done',
        name: '已完成',
        tasks: [],
      },
    ],
  };
};

export const initTodo = () => {
  const newId = shortid.generate();
  return {
    currentId: newId,
    editId: '',
    data: [
      {
        ...newTodo(),
        id: newId,
      },
    ],
  };
};
