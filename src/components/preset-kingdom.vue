<template>
  <div>
  <a :id="kingdom.name" />
    <div class="preset-kingdom_title">
      <div class="preset-kingdom_title left-top-sign-div">
        <div class="preset-kingdom_title_name">{{kingdom.name}}</div>
        <div class="preset-kingdom_title_sets " v-for="set in sets" :key="set.setId">
          <span class="preset-kingdom_set-name" :class="[set.setId]">{{set.name}}</span>
        </div>
      </div>
      <div class="right-top-sign-div"><a href="#TopofThePage">
        <svg  height="32px" width="32px" xmlns="http://www.w3.org/2000/svg" >
          <path d="M16,0C7.163,0,0,7.164,0,16c0,8.837,7.163,16,16,16c8.836,0,16-7.163,16-16C32,7.164,24.836,0,16,0z M16,30   C8.28,30,1.969,23.72,1.969,16C1.969,8.28,8.28,2,16,2c7.72,0,14,6.28,14,14C30,23.72,23.72,30,16,30z" fill="#121313"/>
          <path d="M16.699,11.293c-0.384-0.38-1.044-0.381-1.429,0l-6.999,6.899c-0.394,0.391-0.394,1.024,0,1.414   c0.395,0.391,1.034,0.391,1.429,0l6.285-6.195l6.285,6.196c0.394,0.391,1.034,0.391,1.429,0c0.394-0.391,0.394-1.024,0-1.414   L16.699,11.293z" fill="#121313"/>
        </svg>  
      </a></div>
    </div>

    <div class="preset-kingdom_metadata" v-if="hasMetadata">
      <div class="preset-kingdom_metadata_use-platinums-and-colonies"
          v-if="kingdom.metadata.useColonies">
        Use Platinums/Colonies
      </div>
      <div class="preset-kingdom_metadata_use-shelters"
          v-if="kingdom.metadata.useShelters">
        Use Shelters
      </div>
    </div>

    <grid-layout-component
      :items="getSupplyCards(kingdom)"
      :number-of-columns="numberOfColumnsForSupplyCards"
      :is-vertical="true"
    >
      <template v-slot:default="slotProps">
        <static-card-with-set-component :card="slotProps.item" />
        <bane-card-cover-component v-if="isBaneCard(slotProps.item)" />
      </template>
    </grid-layout-component>

    <copy-button-component 
      :text="getCopyText(kingdom)"
      class="preset-kingdom-copy-button"
    />

    <div v-if="titleForAddons.length">
      <div class="preset-kingdom__addon-title">
        {{titleForAddons}}
      </div>
      <grid-layout-component
        :items="getCards(addonIds)"
        :number-of-columns="numberOfColumnsForAddons"
        :is-vertical="false"
      >
        <template v-slot:default="slotProps">
          <static-card-with-set-component :card="slotProps.item" />
        </template>
      </grid-layout-component>
    </div>
        
    <div v-if="kingdom.boonIds.length">
      <div class="preset-kingdom__addon-title">Boons</div>
      <grid-layout-component
        :items="getCards(kingdom.boonIds)"
        :number-of-columns="numberOfColumnsForAddons"
        :is-vertical="false"
      >
        <template v-slot:default="slotProps">
          <static-card-with-set-component :card="slotProps.item" />
        </template>
      </grid-layout-component>
    </div>
  </div>
</template>

<script lang="ts">
import GridLayoutComponent from "./grid-layout.vue";
import { DominionKingdom } from "../dominion/dominion-kingdom";
import { DominionSets } from "../dominion/dominion-sets";
import { SupplyCard } from "../dominion/supply-card";
import { State } from "vuex-class";
import { Vue, Component, Prop } from "vue-property-decorator";
import { getMessageForAddonsDescription } from "../utils/messages";
import StaticCardWithSetComponent from "./static-card-with-set.vue";
import BaneCardCoverComponent from "./bane-card-cover.vue";
import CopyButtonComponent from "./copy-button.vue";

const FOUR_COLUMN_SUPPLY_CARD_WIDTH = 450;
const TWO_COLUMN_ADDON_WIDTH = 525;

@Component
export default class PresetKingdom extends Vue {
  constructor() {
    super({
      components: {
        "grid-layout-component": GridLayoutComponent,
        "static-card-with-set-component": StaticCardWithSetComponent,
        "bane-card-cover-component": BaneCardCoverComponent,
        "copy-button-component": CopyButtonComponent,
      }
    });
  }
  @Prop() readonly kingdom!: DominionKingdom;
  @State(state => state.window.width) windowWidth!: number;
  @State(state => state.window.isEnlarged) readonly isEnlarged!: boolean;
  
  get sets() {
    return this.kingdom.setIds.map(DominionSets.getSetById);
  }

  get numberOfColumnsForSupplyCards() {
    return this.isEnlarged ? 2 : this.windowWidth <= FOUR_COLUMN_SUPPLY_CARD_WIDTH ? 4 : 5;
  }

  get numberOfColumnsForAddons() {
    return this.isEnlarged ? 1 : this.windowWidth <= TWO_COLUMN_ADDON_WIDTH ? 2 : 3;
  }

  get titleForAddons() {
    const hasEvents = this.kingdom.eventIds.length > 0;
    const hasLandmarks = this.kingdom.landmarkIds.length > 0;
    const hasProjects = this.kingdom.projectIds.length > 0;
    return getMessageForAddonsDescription(hasEvents, hasLandmarks, hasProjects);
  }

  get addonIds() {
    return this.kingdom.eventIds.concat(
        this.kingdom.landmarkIds, this.kingdom.projectIds);
  }

  get hasMetadata() {
    return this.kingdom.metadata.useColonies || this.kingdom.metadata.useShelters;
  }

  getSupplyCards(kingdom: DominionKingdom) {
    const cardIds = this.kingdom.supplyIds.concat();
    if (this.kingdom.baneCardId) {
      cardIds.push(this.kingdom.baneCardId);
    }
    return this.getCards(cardIds);
  }

  getCards(cardIds: string[]) {
    return cardIds.map(DominionSets.getCardById);
  }

  isBaneCard(supplyCard: SupplyCard) {
    return this.kingdom.baneCardId &&
      this.kingdom.baneCardId == supplyCard.id;
  }

  getCopyText(kingdom: DominionKingdom) {
    return this.getSupplyCards(kingdom).map((card) => card.name).join(", ");
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