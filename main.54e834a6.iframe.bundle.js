(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{"./.storybook/initMswWorker.js":function(module,__webpack_exports__,__webpack_require__){"use strict";(function(global){async function initMswWorker(){if(void 0!==global.process);else{var worker=__webpack_require__("./src/api-mock/browser.js").worker;await worker.start({serviceWorker:{url:"/airview-frontend/mockServiceWorker.js"}})}}__webpack_require__.d(__webpack_exports__,"a",(function(){return initMswWorker}))}).call(this,__webpack_require__("./node_modules/webpack/buildin/global.js"))},"./.storybook/preview.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"parameters",(function(){return parameters})),__webpack_require__.d(__webpack_exports__,"decorators",(function(){return decorators}));__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var _siteConfig$theme$col,_siteConfig$theme$col2,react=__webpack_require__("./node_modules/react/index.js"),react_default=__webpack_require__.n(react),CssBaseline=__webpack_require__("./node_modules/@material-ui/core/esm/CssBaseline/CssBaseline.js"),ThemeProvider=__webpack_require__("./node_modules/@material-ui/styles/esm/ThemeProvider/ThemeProvider.js"),jss_esm=__webpack_require__("./node_modules/jss/dist/jss.esm.js"),jssPreset=__webpack_require__("./node_modules/@material-ui/styles/esm/jssPreset/jssPreset.js"),StylesProvider=__webpack_require__("./node_modules/@material-ui/styles/esm/StylesProvider/StylesProvider.js"),jss_plugin_compose_esm=__webpack_require__("./node_modules/jss-plugin-compose/dist/jss-plugin-compose.esm.js"),react_router_dom=__webpack_require__("./node_modules/react-router-dom/esm/react-router-dom.js"),createTheme=__webpack_require__("./node_modules/@material-ui/core/esm/styles/createTheme.js"),site_config=__webpack_require__("./src/site-config.json"),pxToRem=Object(createTheme.a)().typography.pxToRem,materialUiTheme=Object(createTheme.a)({overrides:{MuiCssBaseline:{"@global":{html:{textSizeAdjust:"none"},"html body":{"--tina-z-index-2":1099}}}},palette:{primary:{main:null!==(_siteConfig$theme$col=site_config.theme.color)&&void 0!==_siteConfig$theme$col?_siteConfig$theme$col:"#1976d2"},secondary:{main:null!==(_siteConfig$theme$col2=site_config.theme.color)&&void 0!==_siteConfig$theme$col2?_siteConfig$theme$col2:"#1976d2"}},typography:{fontFamily:"-apple-system, BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'",fontWeightLight:300,fontWeightRegular:400,fontWeightMedium:500,fontWeightBold:600,h1:{fontSize:pxToRem(40),fontWeight:600},h2:{fontSize:pxToRem(32),fontWeight:600},h3:{fontSize:pxToRem(28),fontWeight:600},h4:{fontSize:pxToRem(24),fontWeight:600},h5:{fontSize:pxToRem(20),fontWeight:600},h6:{fontSize:pxToRem(18),fontWeight:600},subtitle1:{fontWeight:600}}}),initMswWorker=__webpack_require__("./.storybook/initMswWorker.js");function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}Object(initMswWorker.a)();var parameters={actions:{argTypesRegex:"^on[A-Z].*"},layout:"centered"},decorators=[function(Story){var jss=Object(jss_esm.b)({plugins:[].concat(_toConsumableArray(Object(jssPreset.a)().plugins),[Object(jss_plugin_compose_esm.a)()])});return react_default.a.createElement(react_router_dom.a,null,react_default.a.createElement(ThemeProvider.a,{theme:materialUiTheme},react_default.a.createElement(StylesProvider.b,{jss:jss},react_default.a.createElement(CssBaseline.a,null),react_default.a.createElement(Story,null))))}]},"./src/api-mock/browser.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"worker",(function(){return worker}));__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var msw__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/msw/lib/esm/index.js"),_handlers__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/api-mock/handlers.js");function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var worker=msw__WEBPACK_IMPORTED_MODULE_1__.a.apply(void 0,function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}(_handlers__WEBPACK_IMPORTED_MODULE_2__.a))},"./src/api-mock/data.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"b",(function(){return groups})),__webpack_require__.d(__webpack_exports__,"a",(function(){return controls})),__webpack_require__.d(__webpack_exports__,"c",(function(){return resources}));var dayjs__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/dayjs/dayjs.min.js"),dayjs__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_0__),groups=[{id:1,title:"Control group will resolve with controls"},{id:2,title:"Control group will resolve with no controls"},{id:3,title:"Control group will resolve with error"}],controls={1:[{id:1,name:"Control will resolve with resources",severity:"Low",applied:5,exempt:6,control:{name:"Control label 1",url:"/"},frameworks:[{name:"FWRK1",url:"/"},{name:"FWRK2",url:"/"}],qualityModel:"Control type test label 1",lifecycle:"Lifecycle test label 1"},{id:2,name:"Control will resolve with no resources",severity:"Medium",applied:5,exempt:6,control:{name:"Control label 2",url:"/"},frameworks:[{name:"FWRK1",url:"/"},{name:"FWRK2",url:"/"}],qualityModel:"Control type test label 2",lifecycle:"Lifecycle test label 2"},{id:3,name:"Control will resolve with error",severity:"High",applied:5,exempt:6,control:{name:"Control label 3",url:"/"},frameworks:[{name:"FWRK1",url:"/"},{name:"FWRK2",url:"/"}],qualityModel:"Control type test label 3",lifecycle:"Lifecycle test label 3"}],2:[]},resources={1:[{id:1,type:"Test instance 1",reference:"Instance reference",environment:"Production",lastSeen:dayjs__WEBPACK_IMPORTED_MODULE_0___default()().toISOString(),status:"Monitoring",pending:!1},{id:2,type:"Test instance 2",reference:"Instance reference",environment:"Development",lastSeen:dayjs__WEBPACK_IMPORTED_MODULE_0___default()().subtract(1,"day").toISOString(),status:"Non-Compliant",pending:!1,evidence:"Markdown Content"},{id:3,type:"Test instance 3",reference:"Instance reference",environment:"Development",lastSeen:dayjs__WEBPACK_IMPORTED_MODULE_0___default()().subtract(1,"month").toISOString(),status:"Exempt",pending:!1,exemptionData:{ticket:"Ticket label for test instance 3",expires:dayjs__WEBPACK_IMPORTED_MODULE_0___default()().toISOString(),resources:["Resource One","Resource Two","Resource Three"]}},{id:4,type:"Test instance 4",reference:"Instance reference",environment:"Development",lastSeen:dayjs__WEBPACK_IMPORTED_MODULE_0___default()().subtract(1,"year").toISOString(),status:"Exempt",pending:!0},{id:5,type:"Test instance 5",reference:"Instance reference",environment:"Development",lastSeen:dayjs__WEBPACK_IMPORTED_MODULE_0___default()().subtract(2,"year").toISOString(),status:"Exempt",pending:!0}],2:[]}},"./src/api-mock/handlers.js":function(module,__webpack_exports__,__webpack_require__){"use strict";(function(Buffer){__webpack_require__.d(__webpack_exports__,"a",(function(){return handlers}));var msw__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/msw/lib/esm/rest-deps.js"),_data__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/api-mock/data.js"),handlers=[msw__WEBPACK_IMPORTED_MODULE_0__.c.get("https://testapi.dev/quality-models",(function(req,res,ctx){return res(ctx.delay(500),ctx.json(_data__WEBPACK_IMPORTED_MODULE_1__.b))})),msw__WEBPACK_IMPORTED_MODULE_0__.c.get("https://testapi.dev/applications/:application_id/control-overviews/",(function(req,res,ctx){var controlId=req.url.searchParams.get("qualityModelId");return"3"===controlId?res(ctx.delay(500),ctx.status(500),ctx.json({message:"Error fetching data"})):res(ctx.delay(500),ctx.json(_data__WEBPACK_IMPORTED_MODULE_1__.a[controlId]))})),msw__WEBPACK_IMPORTED_MODULE_0__.c.get("https://testapi.dev/applications/:application_id/monitored-resources",(function(req,res,ctx){var technicalControlId=req.url.searchParams.get("technicalControlId");return"3"===technicalControlId?res(ctx.delay(500),ctx.status(500),ctx.json({message:"Error fetching data"})):res(ctx.delay(500),ctx.json(_data__WEBPACK_IMPORTED_MODULE_1__.c[technicalControlId]))})),msw__WEBPACK_IMPORTED_MODULE_0__.c.get("https://api.github.com/repos/AirWalk-Digital/airview_demo_applications/contents/microsoft_teams/_index.md",(function(req,res,ctx){var branch=req.url.searchParams.get("ref"),markdownResponse="main"===branch?"main branch content":`${branch} content`,encodedData=Buffer.from(markdownResponse).toString("base64");return res(ctx.json({content:encodedData}))})),msw__WEBPACK_IMPORTED_MODULE_0__.c.get("/api/storage/applications/microsoft_teams/_index.md",(function(req,res,ctx){return res(ctx.json("Non-preview content"))})),msw__WEBPACK_IMPORTED_MODULE_0__.c.get("https://api.github.com/repos/AirWalk-Digital/airview_demo_applications/contents/microsoft_teams/knowledge/activity_feed_guide/_index.md",(function(req,res,ctx){var branch=req.url.searchParams.get("ref"),markdownResponse="main"===branch?"main branch content":`${branch} content`,encodedData=Buffer.from(markdownResponse).toString("base64");return res(ctx.json({content:encodedData}))})),msw__WEBPACK_IMPORTED_MODULE_0__.c.get("/api/storage/applications/microsoft_teams/knowledge/activity_feed_guide/_index.md",(function(req,res,ctx){return res(ctx.json("Non-preview content"))}))]}).call(this,__webpack_require__("./node_modules/buffer/index.js").Buffer)},"./src/site-config.json":function(module){module.exports=JSON.parse('{"siteTitle":"AirView","version":"1.0.0","theme":{"logoSrc":"/logo-airwalk-reply.svg","color":"#002b3d"},"contentRepositories":{"application":{"workingRepoName":"AirWalk-Digital/airview_demo_applications","workingBranchName":"main","staticStorageFolderName":"/storage/applications/"}}}')},"./src/stories lazy recursive ^\\.\\/.*$ include: (?:\\/src\\/stories(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.(js|jsx|ts|tsx))$":function(module,exports,__webpack_require__){var map={"./accordion-menu/accordion-menu.stories":["./src/stories/accordion-menu/accordion-menu.stories.js",0,2,31,6],"./accordion-menu/accordion-menu.stories.js":["./src/stories/accordion-menu/accordion-menu.stories.js",0,2,31,6],"./application-creator/application-creator.stories":["./src/stories/application-creator/application-creator.stories.js",0,1,2,3,7],"./application-creator/application-creator.stories.js":["./src/stories/application-creator/application-creator.stories.js",0,1,2,3,7],"./application-tile/application-tile.stories":["./src/stories/application-tile/application-tile.stories.js",0,1,2,4,8],"./application-tile/application-tile.stories.js":["./src/stories/application-tile/application-tile.stories.js",0,1,2,4,8],"./applications-index-template/applications-index-template.stories":["./src/stories/applications-index-template/applications-index-template.stories.js",0,1,2,3,9],"./applications-index-template/applications-index-template.stories.js":["./src/stories/applications-index-template/applications-index-template.stories.js",0,1,2,3,9],"./branch-creator/branch-creator.stories":["./src/stories/branch-creator/branch-creator.stories.js",0,1,2,3,10],"./branch-creator/branch-creator.stories.js":["./src/stories/branch-creator/branch-creator.stories.js",0,1,2,3,10],"./branch-switcher/branch-switcher.stories":["./src/stories/branch-switcher/branch-switcher.stories.js",0,1,2,3,11],"./branch-switcher/branch-switcher.stories.js":["./src/stories/branch-switcher/branch-switcher.stories.js",0,1,2,3,11],"./breadcrumb/breadcrumb.stories":["./src/stories/breadcrumb/breadcrumb.stories.js",0,12],"./breadcrumb/breadcrumb.stories.js":["./src/stories/breadcrumb/breadcrumb.stories.js",0,12],"./compliance-table/compliance-table.stories":["./src/stories/compliance-table/compliance-table.stories.js",0,1,3,4,13],"./compliance-table/compliance-table.stories.js":["./src/stories/compliance-table/compliance-table.stories.js",0,1,3,4,13],"./content-committer/content-committer.stories":["./src/stories/content-committer/content-committer.stories.js",0,1,2,3,14],"./content-committer/content-committer.stories.js":["./src/stories/content-committer/content-committer.stories.js",0,1,2,3,14],"./control-overview/control-overview.stories":["./src/stories/control-overview/control-overview.stories.js",0,1,3,4,15],"./control-overview/control-overview.stories.js":["./src/stories/control-overview/control-overview.stories.js",0,1,3,4,15],"./icon-chip/icon-chip.stories":["./src/stories/icon-chip/icon-chip.stories.js",16],"./icon-chip/icon-chip.stories.js":["./src/stories/icon-chip/icon-chip.stories.js",16],"./layout-base/layout-base.stories":["./src/stories/layout-base/layout-base.stories.js",0,1,2,3,17],"./layout-base/layout-base.stories.js":["./src/stories/layout-base/layout-base.stories.js",0,1,2,3,17],"./link/link.stories":["./src/stories/link/link.stories.js",18],"./link/link.stories.js":["./src/stories/link/link.stories.js",18],"./markdown-content/markdown-content.stories":["./src/stories/markdown-content/markdown-content.stories.js",5,32,19],"./markdown-content/markdown-content.stories.js":["./src/stories/markdown-content/markdown-content.stories.js",5,32,19],"./menu/menu.stories":["./src/stories/menu/menu.stories.js",0,1,33,20],"./menu/menu.stories.js":["./src/stories/menu/menu.stories.js",0,1,33,20],"./message/message.stories":["./src/stories/message/message.stories.js",21],"./message/message.stories.js":["./src/stories/message/message.stories.js",21],"./page-creator/page-creator.stories":["./src/stories/page-creator/page-creator.stories.js",0,1,2,3,22],"./page-creator/page-creator.stories.js":["./src/stories/page-creator/page-creator.stories.js",0,1,2,3,22],"./page-header/page-header.stories":["./src/stories/page-header/page-header.stories.js",0,1,2,3,23],"./page-header/page-header.stories.js":["./src/stories/page-header/page-header.stories.js",0,1,2,3,23],"./page-meta-editor/page-meta-editor.stories":["./src/stories/page-meta-editor/page-meta-editor.stories.js",0,1,2,3,24],"./page-meta-editor/page-meta-editor.stories.js":["./src/stories/page-meta-editor/page-meta-editor.stories.js",0,1,2,3,24],"./page-section-creator/page-section-creator.stories":["./src/stories/page-section-creator/page-section-creator.stories.js",0,1,2,3,25],"./page-section-creator/page-section-creator.stories.js":["./src/stories/page-section-creator/page-section-creator.stories.js",0,1,2,3,25],"./preview-mode-controller/preview-mode-controller.stories":["./src/stories/preview-mode-controller/preview-mode-controller.stories.js",0,1,2,3,26],"./preview-mode-controller/preview-mode-controller.stories.js":["./src/stories/preview-mode-controller/preview-mode-controller.stories.js",0,1,2,3,26],"./progress-bar/progress-bar.stories":["./src/stories/progress-bar/progress-bar.stories.js",34,27],"./progress-bar/progress-bar.stories.js":["./src/stories/progress-bar/progress-bar.stories.js",34,27],"./pull-request-creator/pull-request-creator.stories":["./src/stories/pull-request-creator/pull-request-creator.stories.js",0,1,2,3,28],"./pull-request-creator/pull-request-creator.stories.js":["./src/stories/pull-request-creator/pull-request-creator.stories.js",0,1,2,3,28],"./search/search.stories":["./src/stories/search/search.stories.js",0,1,2,3,29],"./search/search.stories.js":["./src/stories/search/search.stories.js",0,1,2,3,29],"./text-page-template/text-page-template.stories":["./src/stories/text-page-template/text-page-template.stories.js",0,1,2,3,30],"./text-page-template/text-page-template.stories.js":["./src/stories/text-page-template/text-page-template.stories.js",0,1,2,3,30],"./working-overlay/working-overlay.stories":["./src/stories/working-overlay/working-overlay.stories.js",35],"./working-overlay/working-overlay.stories.js":["./src/stories/working-overlay/working-overlay.stories.js",35]};function webpackAsyncContext(req){if(!__webpack_require__.o(map,req))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}));var ids=map[req],id=ids[0];return Promise.all(ids.slice(1).map(__webpack_require__.e)).then((function(){return __webpack_require__(id)}))}webpackAsyncContext.keys=function webpackAsyncContextKeys(){return Object.keys(map)},webpackAsyncContext.id="./src/stories lazy recursive ^\\.\\/.*$ include: (?:\\/src\\/stories(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.(js|jsx|ts|tsx))$",module.exports=webpackAsyncContext},"./src/stories lazy recursive ^\\.\\/.*$ include: (?:\\/src\\/stories(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.mdx)$":function(module,exports){function webpackEmptyAsyncContext(req){return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}))}webpackEmptyAsyncContext.keys=function(){return[]},webpackEmptyAsyncContext.resolve=webpackEmptyAsyncContext,module.exports=webpackEmptyAsyncContext,webpackEmptyAsyncContext.id="./src/stories lazy recursive ^\\.\\/.*$ include: (?:\\/src\\/stories(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.mdx)$"},"./storybook-config-entry.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__("./node_modules/unfetch/dist/unfetch.module.js");var global_window=__webpack_require__("./node_modules/global/window.js"),window_default=__webpack_require__.n(global_window),composeConfigs=__webpack_require__("./node_modules/@storybook/preview-web/dist/esm/composeConfigs.js"),PreviewWeb=__webpack_require__("./node_modules/@storybook/preview-web/dist/esm/PreviewWeb.js"),ClientApi=__webpack_require__("./node_modules/@storybook/client-api/dist/esm/ClientApi.js"),esm=__webpack_require__("./node_modules/@storybook/addons/dist/esm/index.js"),dist_esm=__webpack_require__("./node_modules/@storybook/channel-postmessage/dist/esm/index.js"),channel_websocket_dist_esm=__webpack_require__("./node_modules/@storybook/channel-websocket/dist/esm/index.js"),importers=(__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),[async function(path){if(/^\.[\\/](?:src\/stories(?:\/(?!\.)(?:(?:(?!(?:^|\/)\.).)*?)\/|\/|$)(?!\.)(?=.)[^/]*?\.stories\.mdx)$/.exec(path)){var pathRemainder=path.substring(14);return __webpack_require__("./src/stories lazy recursive ^\\.\\/.*$ include: (?:\\/src\\/stories(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.mdx)$")("./"+pathRemainder)}},async function(path){if(/^\.[\\/](?:src\/stories(?:\/(?!\.)(?:(?:(?!(?:^|\/)\.).)*?)\/|\/|$)(?!\.)(?=.)[^/]*?\.stories\.(js|jsx|ts|tsx))$/.exec(path)){var pathRemainder=path.substring(14);return __webpack_require__("./src/stories lazy recursive ^\\.\\/.*$ include: (?:\\/src\\/stories(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.(js|jsx|ts|tsx))$")("./"+pathRemainder)}}]);var SERVER_CHANNEL_URL=window_default.a.SERVER_CHANNEL_URL,channel=Object(dist_esm.a)({page:"preview"});if(esm.a.setChannel(channel),SERVER_CHANNEL_URL){var serverChannel=Object(channel_websocket_dist_esm.a)({url:SERVER_CHANNEL_URL});esm.a.setServerChannel(serverChannel),window.__STORYBOOK_SERVER_CHANNEL__=serverChannel}var preview=new PreviewWeb.a;window.__STORYBOOK_PREVIEW__=preview,window.__STORYBOOK_STORY_STORE__=preview.storyStore,window.__STORYBOOK_ADDONS_CHANNEL__=channel,window.__STORYBOOK_CLIENT_API__=new ClientApi.a({storyStore:preview.storyStore}),preview.initialize({importFn:async function importFn(path){for(var i=0;i<importers.length;i++){var moduleExports=await importers[i](path);if(moduleExports)return moduleExports}},getProjectAnnotations:function(){return Object(composeConfigs.a)([__webpack_require__("./node_modules/@storybook/addon-docs/dist/esm/frameworks/common/config.js"),__webpack_require__("./node_modules/@storybook/addon-docs/dist/esm/frameworks/react/config.js"),__webpack_require__("./node_modules/@storybook/react/dist/esm/client/preview/config.js"),__webpack_require__("./node_modules/@storybook/addon-links/dist/esm/preset/addDecorator.js"),__webpack_require__("./node_modules/@storybook/addon-actions/dist/esm/preset/addDecorator.js"),__webpack_require__("./node_modules/@storybook/addon-actions/dist/esm/preset/addArgs.js"),__webpack_require__("./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js"),__webpack_require__("./node_modules/@storybook/addon-backgrounds/dist/esm/preset/addParameter.js"),__webpack_require__("./node_modules/@storybook/addon-measure/dist/esm/preset/addDecorator.js"),__webpack_require__("./node_modules/@storybook/addon-outline/dist/esm/preset/addDecorator.js"),__webpack_require__("./node_modules/@storybook/addon-interactions/dist/esm/preset/argsEnhancers.js"),__webpack_require__("./.storybook/preview.js")])}})},0:function(module,exports,__webpack_require__){__webpack_require__("./node_modules/@storybook/core-client/dist/esm/globals/polyfills.js"),__webpack_require__("./node_modules/@storybook/core-client/dist/esm/globals/globals.js"),module.exports=__webpack_require__("./storybook-config-entry.js")},1:function(module,exports){}},[[0,42,43]]]);