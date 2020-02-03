<template>
  <div>
    <div>
      <span> {{ nbKingdomRecommmendedSet }} Recommended Kingdoms Sets </span>
          <div  class="preset-set_title">
            <div class="preset-kingdom_title_sets" v-for="kingdom in kingdoms" v-show="toshow(kingdom)">
              <a style="text-decoration: none"  :href="'#' + kingdom.name">
                <span 
              class="preset-kingdom_set-name"  :class="kingdom.setIds[0]">{{kingdom.name}}</span>
              </a>
            </div>
          </div>
        </div>
        <preset-kingdom-component v-for="kingdom in kingdoms" :key="kingdom.name" :kingdom="kingdom" v-show="toshow(kingdom)"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PresetKingdomComponent from "./preset-kingdom.vue";
import { UPDATE_SELECTED_KDSET } from "../stores/pages-store-mutation-types";
import { DominionKingdoms } from "../dominion/dominion-kingdoms";
import { DominionKingdom } from "../dominion/dominion-kingdom";
import { SetId } from "../dominion/set-id";
import { State } from "../stores/pages-store";


@Component
export default class KingdomsList extends Vue {
  constructor() {
    super( {
      components: {
         "preset-kingdom-component": PresetKingdomComponent
      },
    } )
  }

  ListSet:SetId[]=[];
  get kingdoms() {
    this.$store.commit(UPDATE_SELECTED_KDSET, this.$storage.get("selectedKDSetId", SetId.BASE_SET));
    const setId = (this.$store.state as State).selectedKDSetId;
    if (setId === ("All" as SetId)) {
      return DominionKingdoms.getAllKingdoms();
    }
    if (!(setId in DominionKingdoms.kingdoms)) { return []; }
    return DominionKingdoms.kingdoms[setId] 
  }
  
  get nbKingdomRecommmendedSet() {
    let nbking=0
    for (var king of this.kingdoms!) {
      if (this.toshow(king) == true) {
        nbking +=1; 
      }
    }
    return nbking;
  }
  
  toshow(kingdom: DominionKingdom) {
    let elm
    let todisplay = true
    this.ListSet.concat(kingdom.setIds as SetId[]);
    for (var set of kingdom.setIds) {
      elm = document.getElementById(set)!;
      if (elm !== null && elm.getAttribute('class') !==null) {
        if (! elm.getAttribute('class')!.includes(set)) {
          return false;
    } } } 
    return todisplay;
  }
  
} 
Vue.component("preset-kingdom-component", PresetKingdomComponent);
</script>

<style>

</style>