<template>
  <div>
    <div>
      <span> {{ nbKingdomRecommmendedSet }} Recommended Kingdoms Sets </span>
    </div>
    <preset-kingdom-component v-for="kingdom in kingdoms" :key="kingdom.name" :kingdom="kingdom"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PresetKingdomComponent from "./preset-kingdom.vue";
import { UPDATE_SELECTED_KDSET } from "../stores/pages-store-mutation-types";
import { DominionKingdoms } from "../dominion/dominion-kingdoms";
import { SetId } from "../dominion/set-id";
import { State } from "../stores/pages-store";


@Component
export default class KingdomsList extends Vue {
  constructor() {
    super( {
      components: { },
    } )
  }

  get kingdoms() {
    this.$store.commit(UPDATE_SELECTED_KDSET, this.$storage.get("selectedKDSetId", SetId.BASE_SET));
    const setId = (this.$store.state as State).selectedKDSetId;
    return DominionKingdoms.kingdoms[setId]; 
  }
  
  get nbKingdomRecommmendedSet() {
    return this.kingdoms!.length;
  }
  
} 
Vue.component("preset-kingdom-component", PresetKingdomComponent);
</script>

<style>

</style>