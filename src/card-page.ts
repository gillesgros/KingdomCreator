import Vue from "vue";
import PageComponent, { MenuItemType } from "./components/page.vue";
import CardOnlinePageComponent from "./components/card-online-page.vue";
import CardOnlinePageLandscapeComponent from "./components/card-online-page-landscape.vue";
import CardOnlinePageOthercardComponent from "./components/card-online-page-othercard.vue";

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
       <card-online-page-othercard-component v-if="false"/>
	   <card-online-page-landscape-component v-if="false"/>
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
    "card-online-page-landscape-component": CardOnlinePageLandscapeComponent,
    "card-online-page-othercard-component": CardOnlinePageOthercardComponent
  }
});

