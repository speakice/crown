import React, { useEffect, useState } from 'react';
import Vditor from 'vditor';
// import { ipcRenderer } from 'electron';
import { saveAs } from 'file-saver';
import hljs from 'hljs';
import { AlignLeftOutlined } from '@ant-design/icons';
import { INote } from '@/pages/note/initial';
import styles from './index.less';
import './index.css';

interface IPropsType {
  onSave: (content: string) => void;
  data: INote;
}
let vditor: Vditor;
export default (props: IPropsType) => {
  const [showOutline, setShowOutline] = useState(false);
  const { onSave, data } = props;
  const { id, content } = data;
  useEffect(() => {
    vditor = new Vditor('vditor', {
      placeholder: '欢迎是使用笔记本',
      toolbar: [],
      toolbarConfig: {
        pin: false,
        hide: false,
      },
      counter: { enable: false },
      cdn: 'https://cdn.jsdelivr.net/npm/vditor', // '.'
      mode: 'ir', // 'ir',
      theme: 'classic', // 'dark',
      icon: 'ant', // 'material',
      outline: true, // 大纲
      preview: {
        markdown: {
          codeBlockPreview: false,
        },
        hljs: {
          enable: true,
          lineNumber: true,
        },
      },
      // typewriterMode: true,
      cache: {
        enable: false,
      },
      value: content,
      blur: onSave,
      input: (value: string) => {},
      upload: {
        accept: 'image/*',
        token: 'test',
        url: '/api/upload/editor',
        linkToImgUrl: '/api/upload/fetch',
        linkToImgCallback: response => {
          console.log('response', response);
        },
        handler(files) {
          console.log(files);
          const [firstFile] = files;
          // ipcRenderer.send('open-file-dialog');
          saveAs(firstFile, 'firstFile.png');
          return null;
        },
        withCredentials: true,
        filename(name) {
          return name
            .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
            .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
            .replace('/\\s/g', '');
        },
      },
      after() {
        // vditor.setValue(content);
      },
    });
    // vditor.setTheme('dark');
  });
  const outlineClass = showOutline ? styles.showOutline : styles.hideOutline;
  return (
    <div className={`${styles.VEditor} ${outlineClass}`}>
      <div id="vditor" />
      <AlignLeftOutlined
        onClick={() => setShowOutline(!showOutline)}
        className={styles.outline}
      />
    </div>
  );
};
