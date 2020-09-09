import { defineConfig } from 'umi';

export default defineConfig({
  hash: true,
  history: {
    type: 'hash',
  },
  publicPath: './',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { 
      path: '/', 
      component: '@/pages/index',
      routes:[
        { path: '/', redirect: '/todo' },
        {path:'todo',component:'./todo/index'},
        {path:'note',component:'./note/index'},
        {path:'aim',component:'./aim/index'},
      ] 
    }
  ],
});
