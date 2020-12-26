import React, { useState } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { message } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { history } from 'umi';
import styles from './index.less';

interface IMenu {
  id: string;
  icon: Array<JSX.Element> | Array<string>;
  name: string;
  route: string;
}

interface IPropsType {
  icon: string;
  title: string;
  menus: Array<IMenu>;
  onChange: (x: string) => void;
  setShowSecondList: (visible: boolean) => void;
}

export default (props: IPropsType) => {
  const { pathname } = history.location;
  const pathArr = pathname.split('/');
  const [active, setActive] = useState(pathArr[1] || 'todo');
  const { icon, title, menus = [], onChange, setShowSecondList } = props;
  const onMenuClick = (id: string, route: string) => {
    setActive(id);
    history.push(route);
    onChange(id);
  };

  return (
    <div className={styles.LeftMenu}>
      <CopyToClipboard
        text="暂不支持"
        onCopy={() => message.success('复制成功')}
      >
        <img className={styles.logo} src={icon} />
      </CopyToClipboard>
      {menus.map(menu => {
        const isActive = active === menu.id;
        const itemColor = isActive ? '#57bd69' : 'white';
        const iconIndex = isActive ? 1 : 0;
        return (
          <div
            key={menu.id}
            onClick={() => onMenuClick(menu.id, menu.route)}
            style={{ color: itemColor }}
            className={styles.menu}
          >
            {menu.icon[iconIndex]}
          </div>
        );
      })}
      <div className={styles.close}>
        <ArrowRightOutlined onClick={() => setShowSecondList(true)} />
      </div>
    </div>
  );
};
