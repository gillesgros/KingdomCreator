import Vue from "vue";
import PageComponent, { MenuItemType } from "./components/page.vue";
import CardOnlinePageComponent from "./components/card-online-page.vue";
import CardOnlineOthercardStandardPageComponent from "./components/card-online-othercard-standard-page.vue";
import CardOnlineOthercardSpecialPageComponent from "./components/card-online-othercard-special-page.vue";

import { initializeWindowListener } from "./stores/setup";
import { store } from "./stores/pages-store";



const SUBTITLE = "Des cartes en Grand";

initializeWindowListener(store);

new Vue({
  el: "#app",
  template: `
  <div>
  <page-component :subtitle="subtitle" :selectedType="selectedType">
       <card-online-page-component v-if="true"/>
       <card-online-othercard-standard-page-component v-if="false"/>
	   <card-online-othercard-special-page-component v-if="false"/>
  </page-component>

  </div>
  `,
  store: store,
  data: {
    selectedType: MenuItemType.CARDS,
	subtitle: SUBTITLE
  },

  components: {
    "page-component": PageComponent,
    "card-online-page-component": CardOnlinePageComponent,
    "card-online-othercard-standard-page-component": CardOnlineOthercardStandardPageComponent,
    "card-online-othercard-special-page-component": CardOnlineOthercardSpecialPageComponent
  }
});

