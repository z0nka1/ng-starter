const MAIN_MENUS = [
  {
    text: 'DEMO',
    icon: 'icon-shang-pin icon',
    link: '/demo',
    children: [
      {
        text: '测试Tab1',
        link: '/demo/test-tab'
      },
      {
        text: '测试Tab2',
        link: '/demo/test-tab2'
      }
    ]
  }
];

/** 菜单配置 */
export const MENUS = [
  {
    text: '主导航',
    group: true,
    children: MAIN_MENUS
  }
];

export function getMenus(menus) {
  return [
    {
      text: '主导航',
      group: true,
      children: menus
    }
  ];
}
