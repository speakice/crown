import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input, Button, Select, DatePicker, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';
import shortid from 'shortid';
import { IAim } from './initial';
import { EAimType } from './SecondList';

interface ITypeProps {
  editId: string;
  data: IAim;
  onSubmit: (data: IAim) => void;
  onEditChange: (type: EAimType, id: string) => void;
}

export default (props: ITypeProps) => {
  const { data, editId, onSubmit, onEditChange } = props;
  const [title, setTitle] = useState(data.title || '');
  const [desc, setDesc] = useState(data.desc || '');
  const [times, setTimes] = useState(data.times || 0);
  const [startDate, setStartDate] = useState(
    data.startDate || moment().format('YYYYMMDD'),
  );
  const [branchs, setBranchs] = useState(
    data.branchs || [{ id: shortid.generate(), name: '' }],
  );
  useEffect(() => {
    setTitle(data.title);
    setDesc(data.desc);
    setTimes(data.times);
    setStartDate(data.startDate);
    setBranchs(data.branchs);
  }, [data.id]);

  const handleAddBranch = () => {
    branchs.push({
      id: shortid.generate(),
      name: '',
      desc: '',
      times: 0,
      currentTimes: 0,
    });
    setBranchs([...branchs]);
    if (branchs.length === 1) {
      setTimes(0);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...data,
      createTime: moment().valueOf(),
      title,
      desc,
      times,
      startDate,
      branchs,
    });
  };
  const handleBranchChange = (key: string, e: ChangeEvent, index: number) => {
    let newBranchs = [...branchs];
    newBranchs[index][key] = (e.target as HTMLInputElement).value;
    setBranchs(newBranchs);
  };
  const setBranchTimes = (num: number, index: number) => {
    let newBranchs = [...branchs];
    setTimes(times - newBranchs[index].times + num);
    newBranchs[index].times = num;
    setBranchs(newBranchs);
  };
  console.log('editAim', data.id);
  const isEditing = data.id === editId;
  return (
    <div className={styles.EditAim}>
      <div className={styles.formItem}>
        <span className={styles.label}>目标名称：</span>
        {isEditing ? (
          <Input
            onChange={e => setTitle(e.target.value)}
            value={title}
            style={{ width: '60%' }}
            placeholder="请输入"
          />
        ) : (
          <div className={styles.aimTitle}>
            {title}
            <span
              className={styles.edit}
              onClick={() => onEditChange(EAimType.start, data.id)}
            >
              编辑
            </span>
          </div>
        )}
      </div>
      <div className={styles.formItem}>
        <span className={styles.label}>描述：</span>
        {isEditing ? (
          <Input.TextArea
            rows={2}
            onChange={e => setDesc(e.target.value)}
            value={desc}
            style={{ width: '60%' }}
            placeholder="请输入"
          />
        ) : (
          <div style={{ width: '60%', wordWrap: 'break-word' }}>{desc}</div>
        )}
      </div>
      {branchs.map((branch, index) => {
        if (!branch) return;
        if (!isEditing && !branch.name) return;
        return (
          <div key={branch.id}>
            <div className={styles.formItem}>
              <span className={styles.label}>分支{index + 1}：</span>
              {isEditing ? (
                <div className={styles.branchTitle}>
                  <Input
                    value={branch.name}
                    onChange={e => handleBranchChange('name', e, index)}
                    placeholder="请输入"
                  />
                  <div className={styles.branchTimes}>
                    <InputNumber
                      placeholder="打卡次数"
                      style={{ flex: 1, margin: '0 6px' }}
                      min={0}
                      value={branch.times}
                      onChange={val => setBranchTimes(Number(val), index)}
                    />
                    次打卡
                  </div>
                </div>
              ) : (
                <div className={styles.branchTitle}>
                  {branch.name}
                  <span>{branch.times}次打卡</span>
                </div>
              )}
            </div>
            <div className={styles.formItem}>
              <span className={styles.label}></span>
              {isEditing ? (
                <Input.TextArea
                  value={branch.desc}
                  onChange={e => handleBranchChange('desc', e, index)}
                  rows={2}
                  style={{ width: '60%' }}
                  placeholder="请输入"
                />
              ) : (
                <div style={{ width: '60%' }}>{branch.desc}</div>
              )}
            </div>
          </div>
        );
      })}
      {isEditing && (
        <div className={styles.formItem}>
          <span className={styles.label}></span>
          <Button
            type="dashed"
            style={{ width: '60%' }}
            onClick={handleAddBranch}
          >
            <PlusOutlined /> 添加分支
          </Button>
        </div>
      )}

      <div className={styles.formItem}>
        <span className={styles.label}>开始时间：</span>
        <div className={styles.dateTimes} style={{ width: '60%' }}>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <DatePicker
                value={moment(startDate)}
                onChange={date => setStartDate(moment(date).format('YYYYMMDD'))}
                placeholder="开始时间"
                style={{ width: 280 }}
              />
            ) : (
              <div>{startDate}</div>
            )}
          </div>
          <div className={styles.times}>
            <span className={styles.label}>预期投入：</span>
            {isEditing ? (
              <InputNumber
                disabled={branchs.length > 0}
                style={{ flex: 1, marginRight: 4 }}
                min={0}
                value={times}
                onChange={val => setTimes(Number(val))}
              />
            ) : (
              <span style={{ color: 'red', marginRight: 4 }}>{times}</span>
            )}
            次打卡
          </div>
        </div>
      </div>
      {isEditing && (
        <div className={styles.formItem}>
          <span className={styles.label}></span>
          <div style={{ width: '60%' }}>
            <Button
              type="primary"
              style={{ width: 280 }}
              onClick={handleSubmit}
            >
              提交
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
