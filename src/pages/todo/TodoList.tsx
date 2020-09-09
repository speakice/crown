import React, { useState } from 'react';
import moment from 'moment';
import styles from './index.less';
import { IColumn, ITask, EStatus, ERate, ERepeat } from './initial';
import { getTodoState, saveTodoState } from '../storage';
import shortid from 'shortid';
import {
  DragDropContext,
  DropResult,
  DraggableLocation,
} from 'react-beautiful-dnd';
import Column from '../components/Column';
import { Input, Rate, Dropdown, Button, Menu } from 'antd';
import { ITodo } from './initial';

const switchColumnTask = (
  todoData: ITodo,
  source: DraggableLocation,
  destination: DraggableLocation,
): ITodo => {
  const { columns } = todoData;
  let task!: ITask;
  let targetColumnIndex!: number;
  const newColumns = columns.map((column, index) => {
    if (column.id === source.droppableId) {
      task = column.tasks[source.index];
      column.tasks.splice(source.index, 1);
    }
    if (column.id === destination.droppableId) {
      targetColumnIndex = index;
    }
    return column;
  });
  if ((targetColumnIndex || targetColumnIndex === 0) && task) {
    newColumns[targetColumnIndex].tasks.splice(destination.index, 0, task);
  }
  return { ...todoData, columns: newColumns };
};

const deleteColumnTask = (
  todoData: ITodo,
  source: DraggableLocation,
): ITodo => ({
  ...todoData,
  columns: todoData.columns.map(column => {
    if (column.id === source.droppableId) {
      column.tasks.splice(source.index, 1);
    }
    return {
      ...column,
    };
  }),
});

const sortTaskByRate = (columns: Array<IColumn>): Array<IColumn> =>
  columns.map((column: IColumn) => {
    column.tasks.sort((a: ITask, b: ITask) => b.rate - a.rate);
    return column;
  });

interface IPropsType {
  todoData: ITodo;
  onChange: (data: ITodo) => void;
}

export default (props: IPropsType) => {
  const { todoData, onChange } = props;
  const { columns = [] } = todoData;
  const [taskRate, setTaskRate] = useState(ERate.one);
  const [inputTask, setInputTask] = useState('');
  const [taskRepeat, setTaskRepeat] = useState(ERepeat.once);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      const newTodoData = deleteColumnTask({ ...todoData }, source);
      onChange(newTodoData);
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const newTodoData = switchColumnTask(todoData, source, destination);
    onChange(newTodoData);
  };
  const rate = (
    <Rate
      allowClear={false}
      value={taskRate}
      defaultValue={ERate.one}
      count={4}
      tooltips={[
        '不紧急不重要',
        '不紧急很重要',
        '很紧急不重要',
        '很紧急很重要',
      ]}
      style={{ fontSize: 14 }}
      onChange={setTaskRate}
    />
  );
  const handleAddTask = (value: string) => {
    if (!inputTask) {
      return;
    }
    columns[0].tasks.unshift({
      id: shortid.generate(),
      status: EStatus.todo,
      content: inputTask,
      rate: taskRate,
      repeat: taskRepeat,
    });
    onChange({ ...todoData, columns });
    setInputTask('');
    setTaskRate(ERate.one);
  };

  const sortedColumns = sortTaskByRate(columns);
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.title}>象限法则日程</div>
      <Input.Search
        value={inputTask}
        className={styles.inputSearch}
        placeholder="添加代办事项，记得打上紧急重要分哦～"
        enterButton={
          // <Dropdown overlay={addMenu}>
          <div style={{ width: 80 }}>
            添加
            {/* <DownOutlined /> */}
          </div>
          // </Dropdown>
        }
        onChange={e => setInputTask(e.target.value)}
        style={{ display: 'block', width: '46%', margin: '0 auto 12px' }}
        size="middle"
        suffix={rate}
        onSearch={handleAddTask}
      />
      <div className={styles.columns}>
        {sortedColumns.map(column => {
          return <Column key={column.id} column={column} />;
        })}
      </div>
    </DragDropContext>
  );
};
