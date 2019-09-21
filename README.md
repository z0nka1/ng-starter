# NgStarter

**Pipeline status**： master:[![pipeline status](http://git.1ziton.com/front-end/ng-starter/badges/master/pipeline.svg)](http://git.1ziton.com/front-end/ng-starter/commits/master)、dev：[![pipeline status](http://git.1ziton.com/front-end/ng-starter/badges/dev/pipeline.svg)](http://git.1ziton.com/front-end/ng-starter/commits/dev)

Angular 项目初始化工程。

- UI 组件基于 `ng-zorro-antd`
- 请求基于`rebirth-http`
- 缓存基于 `rebirth-storage`
- 内置`moment`
- 内置`lodash`
- `./shared/utils/` 目录下有一些常用工具库，开发前请过目一遍

## 自定义主题

- 编辑文件`./src/theme.less` 下的`less变量`即可达到目的，详细见：https://ng.ant.design/docs/customize-theme/zh

## 环境

```
     _                      _
    / \   _ __   __ _ _   _| | __ _ _ __
   / △ \ | '_ \ / _` | | | | |/ _` | '__|
  / ___ \| | | | (_| | |_| | | (_| | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|
                |___/


Angular CLI: 7.2.3
Node: 10.4.1
OS: win32 x64
Angular: 7.2.2
... animations, common, compiler, compiler-cli, core, forms
... http, language-service, platform-browser
... platform-browser-dynamic, router

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.12.3
@angular-devkit/build-angular     0.12.3
@angular-devkit/build-optimizer   0.12.3
@angular-devkit/build-webpack     0.12.3
@angular-devkit/core              7.2.3
@angular-devkit/schematics        7.2.3
@angular/cdk                      6.4.7
@angular/cli                      7.2.3
@ngtools/webpack                  7.2.3
@schematics/angular               7.2.3
@schematics/update                0.12.3
rxjs                              6.4.0
typescript                        3.2.4
webpack                           4.28.4

```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:8082/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
