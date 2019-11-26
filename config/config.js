import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '',
              component: './Welcome',
            },
            {
              path: '/staff-managerment',
              name: 'Quản lý nhân viên',
              icon: 'idcard',
              routes: [
                {
                  path: '/staff-managerment/staff-current',
                  name: 'Nhân viên hiện tại',
                  component: './staff-managerment/staff-current',
                },
                {
                  path: '/staff-managerment/staff-leave',
                  name: 'Nhân viên đã rời công ty',
                  component: './staff-managerment/staff-leave',
                },
                {
                  component: './404',
                },
              ]
            },
            {
              path: '/dayoff-managerment',
              name: 'Quản lý ngày vắng',
              icon: 'rocket',
              routes: [
                {
                  path: '/dayoff-managerment/staff-dayoff',
                  name: 'Quản lý ngày vắng nhân viên',
                  component: './dayoff-managerment/staff-dayoff',
                },
                {
                  path: '/dayoff-managerment/internship-dayoff',
                  name: 'Quản lý ngày vắng thực tập sinh',
                  component: './dayoff-managerment/internship-dayoff',
                },
                {
                  component: './404',
                },
              ]
            },
            {
              path: '/statistic-dayoff-by-month',
              name: 'Thống kê ngày vắng theo tháng',
              icon: 'line-chart',
              routes: [
                {
                  path: '/statistic-dayoff-by-month/list',
                  name: 'Danh sách vắng theo tháng',
                  component: './statistic-dayoff-by-month/list',
                },
                {
                  component: './404',
                },
              ]
            },
            {
              path: '/salary-managerment',
              name: 'Quản lý lương nhân viên',
              icon: 'euro',
              routes: [
                {
                  path: '/salary-managerment/list',
                  name: 'Danh sách lương nhân viên',
                  component: './salary-managerment/list',
                },
                {
                  component: './404',
                },
              ]
            },
            {
              path: '/internship-managerment',
              name: 'Quản lý thực tập sinh',
              icon: 'share-alt',
              routes: [
                {
                  path: '/internship-managerment/internship-current',
                  name: 'Thực tập sinh hiện tại',
                  component: './internship-managerment/internship-current',
                },
                {
                  path: '/internship-managerment/internship-leave',
                  name: 'Thực tập sinh đã rời công ty',
                  component: './internship-managerment/internship-leave',
                },
                {
                  component: './404',
                },
              ]
            },
            {
              path: '/cv-managerment',
              name: 'Quản lý CV',
              icon: 'file-protect',
              routes: [
                {
                  path: '/cv-managerment/list-cv',
                  name: 'Danh sách CV',
                  component: './cv-managerment/list-cv',
                },
                {
                  component: './404',
                },
              ]
            },
            {
              path: '/money-managerment',
              name: 'Quản lý tiền thu chi',
              icon: 'area-chart',
              routes: [
                {
                  path: '/money-managerment/list-money-payment',
                  name: 'Danh sách tiền thu chi',
                  component: './money-managerment/list-money-payment',
                },
                {
                  component: './404',
                },
              ]
            },
            // {
            //   path: '/admin',
            //   name: 'Admin',
            //   icon: 'crown',
            //   component: './Admin',
            //   authority: ['admin'],
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
};
