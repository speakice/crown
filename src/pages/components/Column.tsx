import React, { useState } from 'react';
import { Card } from 'antd';
import styles from './index.less';
import { IColumn, ITask } from '../../db/storage';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

interface PropsType {
  column: IColumn;
}

export default ({ column }: PropsType) => {
  return (
    <div className={styles.Column}>
      <div className={styles.title}>{column.name || column.title}</div>
      <Droppable
        // direction="horizontal"
        droppableId={column.id}
        type="TASK" // 同类拖放
        // mode='standard' | 'virtual'
      >
        {(provided, snapshot) => {
          //snapshot.isDraggingOver
          return (
            <div
              className={styles.taskList}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {column.tasks.map((task, index) => {
                return <Task key={task.id} task={task} index={index} />;
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
