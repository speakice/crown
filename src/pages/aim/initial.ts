import shortid from 'shortid';
import moment from 'moment';

interface IBranch {
  id: string;
  name: string;
  desc: string;
  times: number;
  currentTimes: number;
  [key: string]: any;
}

export interface IAim {
  id: string;
  title: string;
  createTime: number;
  modifyTime: number;
  sort: number;
  times: number;
  currentTimes: number;
  startDate: string;
  desc: string;
  branchs: Array<IBranch>;
}

export const newAim = (id: string) => {
  const today = moment().format('YYYYMMDD');
  return {
    id,
    title: today,
    createTime: moment().valueOf(),
    modifyTime: moment().valueOf(),
    sort: EAimSort.normal,
    startDate: today,
    times: 0,
    currentTimes: 0,
    desc: '',
    branchs: [],
  };
};

export const initAim = () => {
  const newId = shortid.generate();
  return {
    currentId: newId,
    editId: '',
    data: [
      {
        ...newAim(newId),
      },
    ],
  };
};

export enum EAimSort {
  top = 1,
  normal = 2,
}

export interface IAimData {
  currentId: string;
  editId: string;
  data: Array<IAim>;
}
