import { ITodoData, initTodo } from './todo/initial';
import { INoteData, initNote } from './note/initial';
import { IAimData, initAim } from './aim/initial';

export const saveTodoState = (todoData: ITodoData): void => {
  localStorage.setItem('todo', JSON.stringify(todoData));
};
export const getTodoState = (): ITodoData => {
  const localState = localStorage.getItem('todo');
  if (!localState) return initTodo();
  return JSON.parse(localState);
};

export const saveNoteState = (todoData: INoteData): void => {
  localStorage.setItem('note', JSON.stringify(todoData));
};
export const getNoteState = (): INoteData => {
  const localState = localStorage.getItem('note');
  if (!localState) return initNote();
  return JSON.parse(localState);
};

export const saveAimState = (todoData: IAimData): void => {
  localStorage.setItem('aim', JSON.stringify(todoData));
};
export const getAimState = (): IAimData => {
  const localState = localStorage.getItem('aim');
  if (!localState) return initAim();
  return JSON.parse(localState);
};

export const getAppData = () => {
  return {
    todo: getTodoState(),
    note: getNoteState(),
    aim: getAimState(),
  };
};
let db: IDBDatabase;
const request = window.indexedDB.open('crown', 1.0);
request.onsuccess = event => {
  db = request.result;
  add()
  console.log('数据库连接成功', request.result);
};
request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
  const db = (event.target as any).result;
  if (!db.objectStoreNames.contains('person')) {
    var objectStore = db.createObjectStore('person', { keyPath: 'id' });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });
  }
};

const add = () => {
  var request = db
    .transaction(['person'], 'readwrite')
    .objectStore('person')
    .add({
      id: 1,
      name: '张三',
      age: 24,
      email: 'zhangsan@example.com',
      obj: { id: 0, name: 'obj' },
    });

  request.onsuccess = function(event) {
    console.log('数据写入成功');
  };

  request.onerror = function(event) {
    console.log('数据写入失败');
  };
};
