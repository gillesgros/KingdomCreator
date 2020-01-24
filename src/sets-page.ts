import Vue from "vue";
import EnlargeButtonComponent from "./components/enlarge-button.vue";
import PageComponent, { MenuItemType } from "./components/page.vue";
import PresetSetcardsComponent from "./components/preset-set-cards.vue";
import SetsSidebarComponent from "./components/sets-sidebar.vue";
import { UPDATE_SELECTED_SET } from "./stores/pages-store-mutation-types";
import { SetId } from "./dominion/set-id";
import { DominionSets } from "./dominion/dominion-sets";
import { DominionSet } from "./dominion/dominion-set";
import { State, store } from "./stores/pages-store";
import { initializeWindowListener } from "./stores/setup";


const SUBTITLE = "Content of Dominion set";

initializeWindowListener(store);

new Vue({
  el: "#app",
  template: `
  <div>
  <page-component :subtitle="subtitle" :selectedType="selectedType">
    <div class="content">
      <sets-sidebar-component />
      <div class="main">
        <div class="sets-description">
          All cards available in this dominion set. Card type are kingdom, ruin, victory, treasure, event, landmark, project, boon.
        </div>
        <preset-setcards-component v-for="set in sets" :key="set.name" :set="set" />
      </div>
    </div>
  </page-component>
      <enlarge-button-component />
  </div>
  `,
  store: store,
  data: {
    subtitle: SUBTITLE,
    selectedType: MenuItemType.SETS
  },
  computed: {
    sets: function() {
      this.$store.commit(UPDATE_SELECTED_SET, this.$storage.get("selectedSetId", SetId.BASE_SET));
      const setId = (this.$store.state as State).selectedSetId;
      return [ (DominionSets.sets[setId] as DominionSet) ];
    }
  },
  components: {
    "page-component": PageComponent,
    "preset-setcards-component": PresetSetcardsComponent,
    "sets-sidebar-component": SetsSidebarComponent,
    "enlarge-button-component": EnlargeButtonComponent
  }
});