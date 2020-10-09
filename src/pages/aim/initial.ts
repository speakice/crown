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

export const newAim = (momentFn: moment.Moment = moment(), id: string) => {
  const today = momentFn.format('YYYYMMDD');
  return {
    id,
    title: today,
    createTime: momentFn.valueOf(),
    modifyTime: momentFn.valueOf(),
    sort: EAimSort.normal,
    startDate: today,
    times: 0,
    currentTimes: 0,
    desc: '',
    branchs: [],
  };
};

export const initAim = (momentFn: moment.Moment = moment()) => {
  const newId = shortid.generate();
  return {
    currentId: newId,
    editId: '',
    data: [
      {
        ...newAim(momentFn, newId),
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
