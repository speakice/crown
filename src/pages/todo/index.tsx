import React, { useState } from 'react';
import moment from 'moment';
import styles from './index.less';
import { getTodoState, saveTodoState } from '../storage';
import shortid from 'shortid';
import SecondList, { ETodoType } from './SecondList';
import Todo from './TodoList';
import { ITodo, ITodoData, newTodo, ESort } from './initial';
import { message } from 'antd';
import EmptyStatus from '../../../public/empty.png';

interface ITypeProps {
  showSecondList: boolean;
  setShowSecondList: (visible: boolean) => void;
}

export default (props: ITypeProps) => {
  const { showSecondList, setShowSecondList } = props;
  const [allTodos, setAllTodos] = useState(getTodoState());
  const { currentId = '', editId, data = [] } = allTodos;
  const [currentTodo] = data.filter(item => item.id === currentId);
  // 修改本地todo 改变storage
  const changeTodoData = (newData: ITodoData) => {
    setAllTodos(newData);
    saveTodoState(newData);
  };
  const changeCurrentTodo = (todo: ITodo) => {
    const newDatas = data.filter(item => item.id !== currentId);
    newDatas.push({ ...todo, modifyTime: moment().valueOf() });
    changeTodoData({ ...allTodos, data: newDatas });
  };

  const onAddTodoPage = () => {
    const { data } = allTodos;
    const newId = shortid.generate();
    data.push({ ...newTodo(), id: newId });
    changeTodoData({ ...allTodos, currentId: newId, editId: newId, data });
  };

  const onEditChange = (type: ETodoType, id: string, title?: string) => {
    console.log('==22==', type, id);
    const { data } = allTodos;
    if (type === ETodoType.start) {
      changeTodoData({ ...allTodos, editId: id });
      return;
    }
    if (type === ETodoType.delete) {
      const newData = data.filter(item => item.id !== id);
      changeTodoData({ ...allTodos, data: newData });
      return;
    }
    if (type === ETodoType.top) {
      const newData = data.map(item => {
        if (item.id === id) {
          item.sort = item.sort === ESort.top ? ESort.normal : ESort.top;
          item.modifyTime = moment().valueOf();
        }
        return item;
      });
      changeTodoData({ ...allTodos, editId: '', data: newData });
      return;
    }
    if (type === ETodoType.rename) {
      if (!title) {
        message.error('标题不能为空');
        return;
      }
      const newData = data.map(item => {
        if (item.id === id) {
          item.title = title;
          item.modifyTime = moment().valueOf();
        }
        return item;
      });
      changeTodoData({ ...allTodos, editId: '', data: newData });
    }
  };

  return (
    <div className={styles.Todo}>
      {showSecondList && (
        <SecondList
          list={data}
          currentId={currentId}
          editId={editId}
          onEditChange={onEditChange}
          onChange={currentId => changeTodoData({ ...allTodos, currentId })}
          onAdd={onAddTodoPage}
          setShowSecondList={setShowSecondList}
        />
      )}

      <div className={styles.content}>
        {currentTodo ? (
          <Todo todoData={currentTodo} onChange={changeCurrentTodo} />
        ) : (
          <div className={styles.empty}>
            <img src={EmptyStatus} alt="没有数据" />
            <span className={styles.emptyWord}>空空如也</span>
          </div>
        )}
      </div>
    </div>
  );
};
