import React, { Children, cloneElement, useState } from 'react';
import { Alert } from 'antd';
import styles from './index.less';
import {
  ScheduleOutlined,
  ScheduleFilled,
  EditOutlined,
  EditFilled,
  AimOutlined,
} from '@ant-design/icons';
import LeftMenu from './components/LeftMenu';
import logo from '../../public/dragtodo.png';

const menus = [
  {
    id: 'todo',
    icon: [<ScheduleOutlined />, <ScheduleFilled />],
    name: '日程代办',
    route: '/todo',
  },
  {
    id: 'note',
    icon: [<EditOutlined />, <EditFilled />],
    name: '笔记心得',
    route: '/note',
  },
  {
    id: 'aim',
    icon: [<AimOutlined />, <AimOutlined />],
    name: '目标进度',
    route: '/aim',
  },
];

interface IProps {
  children: JSX.Element;
}

const handleMenuChange = (type: string) => {};

export default (props: IProps) => {
  const [showSecondList, setShowSecondList] = useState(true);
  const { children } = props;
  return (
    <div className={styles.Index}>
      <LeftMenu
        icon={logo}
        title="林子水"
        menus={menus}
        onChange={handleMenuChange}
        setShowSecondList={setShowSecondList}
      />
      <div className={styles.content}>
        {/* <Alert banner message="Success Text" type="success" /> */}
        {Children.map(children, child => {
          return cloneElement(child, { showSecondList, setShowSecondList });
        })}
      </div>
    </div>
  );
};
