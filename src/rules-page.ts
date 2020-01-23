import Vue from "vue";
import EnlargeButtonComponent from "./components/enlarge-button.vue";
import PageComponent, { MenuItemType } from "./components/page.vue";
import RulebooksComponent from "./components/rulebooks.vue";
import { initializeWindowListener } from "./stores/setup";
import { store } from "./stores/pages-store";

const SUBTITLE = "Original rule books of Dominion Sets";

initializeWindowListener(store);
new Vue({
  el: "#app",
  template: `
  <div>
    <page-component :subtitle="subtitle" :selectedType="selectedType">
      <div class="content main">
        <rulebooks-component />
      </div>
    </page-component>
    <enlarge-button-component />
  </div>
  `,
  store: store,
  data: {
    selectedType: MenuItemType.RULES,
    subtitle: SUBTITLE
  },
  components: {
    "page-component": PageComponent,
    "rulebooks-component": RulebooksComponent,
    "enlarge-button-component": EnlargeButtonComponent
  }
});