<template>
  <div>
    <div class="preset-kingdom_title">
        <div class="preset-kingdom_title_name">{{set.name}}</div>
    </div>

    <!-- Supply Cards -->
    <generic-layout-component :items="getCards(set.supplyCards.concat(OtherCards('Normal Supply Cards')))" title="Kingdoms Cards" shape="card" 
                              :generic-nb-columns="numberOfColumnsForSupplyCards" :is-vertical="true" />
    <!-- generic slot : Events -->
    <generic-layout-component :items="getCards(set.events)" title="Events" shape="card" 
                              :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" />
    <!-- generic slot : Landmarks -->
    <generic-layout-component :items="getCards(set.landmarks)" title="Landmarks" shape="card" 
                              :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" />
    <!-- generic slot : Projects -->
    <generic-layout-component :items="getCards(set.projects)" title="Projects" shape="card" 
                              :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" />
    <!-- generic slot : Boons -->
    <generic-layout-component :items="getCards(set.boons)" title="Boons" shape="card" 
                              :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" />

    <!-- otherCards : Basic Supply Cards, Ruins, Shelters, Non-Supply, Travellers, Artefacts, Hexes, -->
    <generic-layout-component v-for="card in OtherCardTypes(true)" :key="card.cardType"
                              :items="getCards(OtherCards(card.cardType))" 
                              :title="card.title" shape="card" 
                              :generic-nb-columns="numberOfColumnsForSupplyCards" :is-vertical="true" />
    <generic-layout-component v-for="card in OtherCardTypes(false)" :key="card.cardType"
                              :items="getCards(OtherCards(card.cardType))" 
                              :title="card.title" shape="card" 
                              :generic-nb-columns="numberOfColumnsForAddons" :is-vertical="false" />
  </div>
</template>

<script lang="ts">
import GenericLayoutComponent from "./generic-layout.vue";
import { DominionSet } from "../dominion/dominion-set";
import { State } from "vuex-class";
import { Vue, Component, Prop } from "vue-property-decorator";
import { SupplyCard } from "../dominion/supply-card";
import { SupplyCardSorter } from "../utils/supply-card-sorter";
import { SortOption } from "../settings/settings";

const FOUR_COLUMN_SUPPLY_CARD_WIDTH = 450;
const TWO_COLUMN_ADDON_WIDTH = 525;

interface genericCardTypes {
  cardType: string;
  title: string;
}

const OTHER_CARD_TYPES: genericCardTypes[] = [
 {cardType: "Knight", title: "Supply Cards - Knights" }, /* dark Ages */
 {cardType: "Castle", title: "Supply Cards - Castles" }, /* empires */
 {cardType: "Basic Cards Treasure", title: "Basic Cards"},
 {cardType: "Basic Cards Victory", title: "Basic Cards"},
 {cardType: "Basic Cards", title: "Basic Cards"},
 {cardType: "Ruins", title: "Basic Cards - Ruins" }, /* dark Ages */
 {cardType: "Shelter", title: "Basic Cards - Shelters" }, /* dark Ages */
 {cardType: "Non-Supply Cards", title: "Non-Supply Cards"},
 {cardType: "Split Cards", title: "Supply Cards Split Piles"},
 {cardType: "Travellers Page", title: "Supply Cards - Travellers - Page Progression" }, /* adventures */
 {cardType: "Travellers Peasant", title: "Supply Cards - Travellers - Peasant Progression" }, /* adventures */
 {cardType: "Prize", title: "Non-Supply Cards"},
 {cardType: "Heirloom", title: "Non-Supply Cards - Heirlooms" }, /*nocturne */
 ];
 
const OTHER_CARD_TYPES_HORIZONTAL: genericCardTypes[] = [
 {cardType: "Hexes", title: "Hexes" }, /*nocturne */
 {cardType: "States", title: "States" }, /*nocturne */
 {cardType: "Artifacts", title: "Artifacts" }, /* Renaissance */
 ];

@Component
export default class PresetSetcards extends Vue {
  constructor() {
    super({
      components: {
        "generic-layout-component": GenericLayoutComponent,
      }
    });
  }
  @Prop() readonly set!: DominionSet;
  @State(state => state.window.width) windowWidth!: number;
  @State(state => state.window.isEnlarged) readonly isEnlarged!: boolean;
  
  get numberOfColumnsForSupplyCards() {
    return this.isEnlarged ? 2 : this.windowWidth <= FOUR_COLUMN_SUPPLY_CARD_WIDTH ? 4 : 5;
  }

  get numberOfColumnsForAddons() {
    return this.isEnlarged ? 1 : this.windowWidth <= TWO_COLUMN_ADDON_WIDTH ? 2 : 3;
  }

  getCards(cardIds: SupplyCard[]) {
    return SupplyCardSorter.sort(cardIds, SortOption.ORDERSTRING);
  }
  
  OtherCards(typeRequested : string) {
   /* return    this.set.otherCards.filter((card)=>(card.type === typeRequested)); */
    return    this.set.otherCards.filter((card)=>(card.type.includes(typeRequested)));
  }
  OtherCardTypes(isVertical:boolean) {
    return isVertical ? OTHER_CARD_TYPES : OTHER_CARD_TYPES_HORIZONTAL; 
  }
}

</script>

<style>

@media (max-width: 450px) {
  .preset-kingdom_title_name {
    font-size: 30px;
    margin-right: 8px;
  }
    
  .preset-kingdom_set-name {
    font-size: 14px;
    padding: 4px 6px;
  }
}

</style>