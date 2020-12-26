import React from 'react';
import { useIdb } from 'react-use-idb';
import moment from 'moment';
import styles from './index.less';
import shortid from 'shortid';
import SecondList, { ETodoType } from './SecondList';
import Todo from './TodoList';
import { ITodo, newTodo, ESort, initTodo } from './initial';
import { message } from 'antd';
import EmptyStatus from '../../../public/empty.png';

interface ITypeProps {
  showSecondList: boolean;
  setShowSecondList: (visible: boolean) => void;
}

export default (props: ITypeProps) => {
  const { showSecondList, setShowSecondList } = props;
  const newId = shortid.generate();
  const initTodos = initTodo(newTodo(moment(), newId), newId);
  const [allTodos, setAllTodos] = useIdb('todo', initTodos);
  const { currentId = '', editId, data = [] } = allTodos || {};
  const [currentTodo] = data.filter((item: ITodo) => item.id === currentId);

  const changeCurrentTodo = (todo: ITodo) => {
    const newDatas = data.filter((item: ITodo) => item.id !== currentId);
    newDatas.push({ ...todo, modifyTime: moment().valueOf() });
    setAllTodos({ ...allTodos, data: newDatas });
  };

  const onAddTodoPage = () => {
    const { data } = allTodos;
    const newId = shortid.generate();
    data.push(newTodo(moment(), newId));
    setAllTodos({ ...allTodos, currentId: newId, editId: newId, data });
  };

  const onEditChange = (type: ETodoType, id: string, title?: string) => {
    console.log('==22==', type, id);
    const { data } = allTodos;
    if (type === ETodoType.start) {
      setAllTodos({ ...allTodos, editId: id });
      return;
    }
    if (type === ETodoType.delete) {
      const newData = data.filter((item: ITodo) => item.id !== id);
      setAllTodos({ ...allTodos, data: newData });
      return;
    }
    if (type === ETodoType.top) {
      const newData = data.map((item: ITodo) => {
        if (item.id === id) {
          item.sort = item.sort === ESort.top ? ESort.normal : ESort.top;
          item.modifyTime = moment().valueOf();
        }
        return item;
      });
      setAllTodos({ ...allTodos, editId: '', data: newData });
      return;
    }
    if (type === ETodoType.rename) {
      if (!title) {
        message.error('标题不能为空');
        return;
      }
      const newData = data.map((item: ITodo) => {
        if (item.id === id) {
          item.title = title;
          item.modifyTime = moment().valueOf();
        }
        return item;
      });
      setAllTodos({ ...allTodos, editId: '', data: newData });
    }
  };

  const handleSearch = (val: string) => {
    const { todo } = JSON.parse(val || '{}');
    if (todo) setAllTodos(todo);
  };
  return (
    <div className={styles.Todo}>
      {showSecondList && (
        <SecondList
          list={data}
          currentId={currentId}
          editId={editId}
          handleSearch={handleSearch}
          onEditChange={onEditChange}
          onChange={currentId => setAllTodos({ ...allTodos, currentId })}
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
