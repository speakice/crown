declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module 'hljs';
declare module 'react-use-idb';
declare module 'react-contextmenu';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
