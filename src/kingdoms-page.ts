import Vue from "vue";
import EnlargeButtonComponent from "./components/enlarge-button.vue";
import PageComponent, { MenuItemType } from "./components/page.vue";
import KingdomsMainComponent from "./components/kingdoms-main.vue";
import KingdomsSidebarComponent from "./components/kingdoms-sidebar.vue";
import { store } from "./stores/pages-store";
import { initializeWindowListener } from "./stores/setup";


const SUBTITLE = "Recommended Kingdoms Sets of 10";

initializeWindowListener(store);

new Vue({
  el: "#app",
  template: `

<div>
  <page-component :subtitle="subtitle" :selectedType="selectedType">
    <div class="content">
      <kingdoms-sidebar-component />
	<!--
      <kingdoms-sidebar-filereader-component />
	-->
      <kingdoms-main-component />
    </div>
  </page-component>
  <enlarge-button-component />
  </div>
  `,
  store: store,
  data: {
    subtitle: SUBTITLE,
    selectedType: MenuItemType.KINGDOMS
  },
  components: {
    "page-component": PageComponent,
    "kingdoms-main-component": KingdomsMainComponent,
    "kingdoms-sidebar-component": KingdomsSidebarComponent,
    "enlarge-button-component": EnlargeButtonComponent
  }
});