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
        <svg viewBox="0 0 32 32" height="20px" width="20px">
          <use xlink:href="#TopOfPage"/>
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