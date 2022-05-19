/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2014/03/22/vuejs-010-release/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2014/07/29/vue-next/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2014/11/09/vue-011-release/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2014/12/08/011-component/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2015/06/11/012-release/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2015/10/26/1.0.0-release/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2015/10/28/why-no-template-url/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2015/12/28/vue-cli/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2016/02/06/common-gotchas/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2016/03/14/march-update/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/2016/04/27/announcing-2.0/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/api/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2014/03/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2014/07/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2014/11/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2014/12/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2014/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2015/06/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2015/10/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2015/12/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2015/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2016/02/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2016/03/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2016/04/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/2016/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/archives/page/2/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/coc/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/css/benchmark.css","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/css/index.css","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/css/page.css","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/css/search.css","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/commits.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/elastic-header.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/firebase.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/grid-component.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/hackernews.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/modal.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/select2.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/svg.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/todomvc.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/examples/tree-view.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/class-and-style.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/comparison.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/components.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/computed.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/conditional.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/custom-directive.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/deployment.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/events.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/forms.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/installation.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/instance.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/join.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/list.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/migration-vue-router.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/migration-vuex.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/migration.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/mixins.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/plugins.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/reactivity.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/render-function.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/routing.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/single-file-components.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/ssr.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/state-management.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/syntax.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/transitioning-state.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/transitions.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/guide/unit-testing.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/Monterail.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/aaha.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/accelebrate.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/alligator_io.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/aussiecasinohex.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/authing.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/autocode.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/bacancy_technology.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/close.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/extended.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/free-access.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vs-close.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vs-fw-bg-small.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vs-fw-bg.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vs-iso.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vs-logo.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vueschool-banner-bg-desktop.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vueschool-banner-bg-mobile.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vueschool-banner-bg-tablet.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vueschool_banner_mobile.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/banners/vueschool_blackfriday_background_tablet_2.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/bestvpn_co.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/betting_bet.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/bit.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/blokt_cryptocurrency_news.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/breakpoint_hit.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/breakpoint_set.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/chaitin.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/check.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/cloudstudio.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/coding.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/coin-bch.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/coin-btc.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/coin-eth.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/coin-ltc.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/components.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/config_add.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/daily.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/das_keyboard.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/daskeyboard.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/data.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/dcloud.gif","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/derek_pollard.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/devexpress.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/devsquad.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/devtools-storage-chrome.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/devtools-storage-edge.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/devtools-storage.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/devtools-timetravel.gif","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/dom-tree.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/dopamine.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/down.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/doximity.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/dronahq.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/earthlink.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/empiricus.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/emq.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/energy_comparison.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/exmax.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/fastcoding_inc.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/fastcoding_inc.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/feed.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/fen_tre_online_solutions.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/fen_tre_online_solutions.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/finclip.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/firestick_tricks.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/flatlogic_templates.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/flowdash.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/foo.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/free_bets_us.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/frontendlove.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/gitee.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/gridsome.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/happy_programmer_llc.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/hbuilder.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/hn-architecture.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/hn.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/html_burger.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/android-icon-144x144.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/android-icon-192x192.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/android-icon-36x36.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/android-icon-48x48.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/android-icon-72x72.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/android-icon-96x96.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-114x114.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-120x120.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-144x144.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-152x152.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-180x180.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-57x57.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-60x60.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-72x72.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-76x76.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon-precomposed.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/apple-icon.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/bacancy_technology.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/favicon-16x16.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/favicon-32x32.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/favicon-96x96.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/ms-icon-144x144.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/ms-icon-150x150.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/ms-icon-310x310.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons/ms-icon-70x70.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/icons_8.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/inkoop.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/intygrate.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/ionic.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/isle_of_code.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/isolutions_uk_limited.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/jqwidgets_.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/jqwidgets_ltd.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/laravel.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/layer0.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/lendio.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/lifecycle.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/line_corporation.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/litslink.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/logged-proxied-data.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/logo.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/logo.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/lowdefy.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/marcus_hiles.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/memberful.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/memory-leak-example.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/menu-blm.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/menu.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/modus.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/mvvm.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/nativescript.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/neds.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/netflix_vpn.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/newicon.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/nuxt.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/okay.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/onsen_ui.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/onyx_gaming_limited.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/opteo.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/oxford-comma.jpg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/passionate_people.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/patreon.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/paypal.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/philip_john_basile.gif","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/piratebay_proxy.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/piratebayproxy.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/plaid__inc_.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/plaid_inc_.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/primevue.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/programmers_io.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/props-events.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/pullrequest.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/qingfuwu-v2.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/quickbooks_tool_hub.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/refurbed.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/retool.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/roadster.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/search-by-algolia.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/search.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/shopware_ag.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/shopware_ag.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/special-sponsor-spot.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/staff_augmentation.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/state.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/stdlib.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/storekit.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/storyblok.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/syncfusion.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/takt.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/tatvasoft.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/team_extension_north_america_inc.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/tee__.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/tendermint.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/tidelift.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/tighten_co.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/tooltwist.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/transition.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/troypoint.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/typescript-type-error.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/unicorn_io.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/usave.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/valuecoders.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vehikl.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vpn_review.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vpnranks.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vpsserver_com.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vue-component-with-preprocessors.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vue-component.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vuejobs.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vuemastery.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vueschool.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vuetify.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/vuetraining_net__note__since_i_m_not_sure_where_else_to_put_it____this_is_replacing_vuescreencasts___they_re_both_run_by_me__i_m_just_switching_where_i_want_my_sponsorship_to_point_.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/watchcartoononline.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/webdock.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/webreinvent_technologies_pvt_ltd.svg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/webucator.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/wilderminds.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/writers_per_hour.jpg","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/x_team.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/y8.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/images/yakaz.png","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/js/common.js","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/js/css.escape.js","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/js/smooth-scroll.min.js","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/js/theme-data.js","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/js/v3-notice.js","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/js/vue.js","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/js/vue.min.js","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/menu/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/page/2/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/perf/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/resources/partners.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/resources/themes.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/support-vuejs/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/api/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/adding-instance-properties.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/avoiding-memory-leaks.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/client-side-storage.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/creating-custom-scroll-directives.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/debugging-in-vscode.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/dockerize-vuejs-app.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/editable-svg-icons.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/form-validation.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/packaging-sfc-for-npm.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/practical-use-of-scoped-slots.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/serverless-blog.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/unit-testing-vue-components.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/cookbook/using-axios-to-consume-apis.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/commits.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/deepstream.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/elastic-header.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/firebase.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/grid-component.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/hackernews.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/modal.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/select2.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/svg.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/todomvc.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/tree-view.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/vue-10-two-way-currency-filter-v2/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/vue-10-two-way-currency-filter-v3/currency-validator.js","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/vue-10-two-way-currency-filter-v3/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/examples/vue-10-two-way-currency-filter/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/class-and-style.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/comparison.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/components-custom-events.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/components-dynamic-async.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/components-edge-cases.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/components-props.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/components-registration.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/components-slots.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/components.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/computed.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/conditional.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/custom-directive.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/deployment.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/events.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/filters.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/forms.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/installation.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/instance.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/join.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/list.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/migration-vue-router.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/migration-vuex.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/migration.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/mixins.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/plugins.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/reactivity.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/render-function.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/routing.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/security.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/single-file-components.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/ssr.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/state-management.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/syntax.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/team.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/testing.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/transitioning-state.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/transitions.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/guide/typescript.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/search/index.html","d41d8cd98f00b204e9800998ecf8427e"],["C:/dev/git/github/Vuejs-FR/vuejs.org/public/v2/style-guide/index.html","d41d8cd98f00b204e9800998ecf8427e"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







