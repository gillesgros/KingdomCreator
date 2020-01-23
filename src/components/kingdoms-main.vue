<template>
  <div class="main">
    <div class="sets-description">
          Players can play Dominion with any set of 10 Kingdom cards, but these sets have been
          specially picked out to be entertaining and show off card interactions and strategies.
    </div>
    <div v-for="lang in Languages" :key="lang">
      <div class="kingdoms" >
        <div style="border-top: 1px solid #ccc;">
          <span> To Filter Sets </span>
        </div>
          <div class="preset-set_title">
            <div class="preset-kingdom_title_sets" v-for="set in sets" :key="set.setId">
              <span :id="set.setId" v-on:click="setfilter(set.setId)" 
          class="preset-kingdom_set-name" :class="set.setId">{{set.name}}</span>
            </div>
          </div>
        <kingdoms-list-component  :key="RefreshOrderForKingdomList"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import KingdomsListComponent from "./kingdoms-list.vue";
import { Vue, Component } from "vue-property-decorator";
import { UPDATE_SELECTED_KDSET } from "../stores/pages-store-mutation-types";
import { DominionKingdoms } from "../dominion/dominion-kingdoms";
import { DominionSets } from "../dominion/dominion-sets";
import { SetId, IgnoreSetIdKingdoms } from "../dominion/set-id";
import { State } from "../stores/pages-store";


@Component
export default class KingdomsMain extends Vue {
  constructor() {
    super( {
      components: {
         "kingdoms-list-component": KingdomsListComponent,
      },
    } )
  }
  RefreshOrderForKingdomList=0;
  get Languages() {
    return  [(this.$store.state as State).selectedLang];
  }
  
  get kingdoms() {
    this.$store.commit(UPDATE_SELECTED_KDSET, this.$storage.get("selectedKDSetId", SetId.BASE_SET));
    const setId = (this.$store.state as State).selectedKDSetId;
    if (setId === ("All" as SetId)) {
      return DominionKingdoms.getAllKingdoms();
    } else {
      return DominionKingdoms.kingdoms[setId];
    }
  }
  
  get sets () {
    return DominionSets.getAllSets().filter((set) => !IgnoreSetIdKingdoms.has(set.setId)); 
  }
  
  setfilter(setid : string) {
    let elm = document.getElementById(setid)!;
    elm.getAttribute('class')!.includes(setid) ? elm.setAttribute('class', 'preset-kingdom_set-name')
                                               : elm.setAttribute('class', 'preset-kingdom_set-name ' + setid)
    this.forceRerender()
  }
  
   forceRerender() {
      this.RefreshOrderForKingdomList  += 1;
  }
  
} 

Vue.component("kingdoms-list-component", KingdomsListComponent);
</script>