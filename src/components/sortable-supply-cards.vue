<template>
  <div>
    <grid-layout-component
      :items="supplyCardsWithBane"
      :number-of-columns="numberOfColumns"
      :is-vertical="true"
      class="sortable-supply-cards"
      :class="{'kingdom-supply--is-enlarged': isEnlarged}"
    >
      <template v-slot:default="slotProps">
        <flipping-card-component :card="slotProps.item" :is-vertical="true"
          @front-visible="handleSupplyCardFrontVisible"
          @flipping-to-back="handleSupplyCardFlippingToBack"
        >
          <template v-slot:highlight-content>
            <div 
              v-if="!isBane(slotProps.item)"
              class="standard-button standard-button--is-primary standard-button--light-border"
              @click.stop="handleSpecify(slotProps.item)"
            >
              Specify
            </div>
          </template>
          <bane-card-cover-component v-if="isBane(slotProps.item)" />
        </flipping-card-component>
      </template>
    </grid-layout-component>
    <copy-button-component
      :text="supplyCardsCopyText"
      class="sortable-supply-card-copy-button"
    />
  </div>
</template>

<script lang="ts">
import FlippingCardComponent from "./flipping-card.vue";
import BaneCardCoverComponent from "./bane-card-cover.vue";
import { Addon } from "../dominion/addon";
import { Coordinate } from "../utils/coordinate";
import { SupplyCard } from "../dominion/supply-card";
import { State, Getter } from "vuex-class";
import { Vue, Component, Watch } from "vue-property-decorator";
import { SortOption } from "../settings/settings";
import { Kingdom } from "../randomizer/kingdom";
import { SupplyCardSorter } from "../utils/supply-card-sorter";
import { TweenLite, Sine } from "gsap";
import { Selection } from "../stores/randomizer/selection";
import { UPDATE_SPECIFYING_REPLACEMENT_SUPPLY_CARD } from "../stores/randomizer/mutation-types";
import GridLayoutComponent from "./grid-layout.vue";
import CopyButtonComponent from "./copy-button.vue";

interface MoveDescriptor {
  elementIndex: number;
  newVisualIndex: number;
}

const ANIMATION_DURATION_SEC = 0.6;
const WINDOW_RESIZE_DELAY_MSEC = 300;

@Component
export default class SortableSupplyCardsComponent extends Vue {
  constructor() {
    super({
      components: {
        "grid-layout-component": GridLayoutComponent,
        "flipping-card-component": FlippingCardComponent,
        "bane-card-cover-component": BaneCardCoverComponent,
        "copy-button-component": CopyButtonComponent,
      }
    });
  }
  @State(state => state.randomizer.kingdom) readonly kingdom!: Kingdom;
  @State(state => state.randomizer.settings.sortOption) readonly sortOption!: SortOption;
  @State(state => state.window.width) readonly windowWidth!: number;
  @State(state => state.window.isEnlarged) readonly isEnlarged!: boolean;
  @State(state => state.randomizer.selection) readonly selection!: Selection;
  @Getter("addons") readonly addons!: Addon[];
  @Getter("hasAddons") readonly hasAddons!: boolean;
  @Getter("addonSummary") readonly addonSummary!: string;
  elementIndexMapping = new Map<number, number>();
  kingdomId: number = 0;
  supplyCards: SupplyCard[] = [];
  numberOfSupplyCardsLoading = 0;
  requiresSupplyCardSort = false;
  activeAnimations: Set<TweenLite> = new Set();
  resizeTimerId: number | null = null;
  replacingCard: SupplyCard | null = null;

  mounted() {
    this.updateActiveSupplyCards();
  }

  get numberOfColumns() {
    return this.isEnlarged ? 2 : this.windowWidth > 450 ? 5 : 4
  }

  get supplyCardsWithBane() {
    const cards = this.supplyCards.concat();
    if (this.kingdom.supply.baneCard) {
      cards.push(this.kingdom.supply.baneCard);
    }
    return cards;
  }

  get supplyCardsCopyText() {
    return this.supplyCards.map((card) => card.name).join(", ");
  }

  @Watch("kingdom")
  handleKingdomChanged() {
    this.updateActiveSupplyCards();
  }

  @Watch("sortOption")
  handleSortOptionChanged() {
    this.requiresSupplyCardSort = true;
    this.attemptToAnimateSupplyCardSort();
  }

  @Watch("windowWidth")
  handleWindowWidthChanged() {
    this.cancelActiveAnimations();
    this.resetCardPositions();

    // Schedule a reset to happen again after the user finishes resizing the window to catch
    // any cases where the reset happened before the elements were fully positioned.
    if (this.resizeTimerId) {
      clearTimeout(this.resizeTimerId);
    }
    this.resizeTimerId = setTimeout(() => this.resetCardPositions(), WINDOW_RESIZE_DELAY_MSEC)
  }

  @Watch("numberOfColumns")
  handleNumberOfColumnsChanged() {
    this.$nextTick(() => this.resetCardPositions());
  }

  isBane(supplyCard: SupplyCard) {
    return this.kingdom.supply.baneCard &&
      this.kingdom.supply.baneCard.id == supplyCard.id;
  }

  handleSpecify(supplyCard: SupplyCard) {
    this.$store.commit(UPDATE_SPECIFYING_REPLACEMENT_SUPPLY_CARD, supplyCard);
  }

  handleSupplyCardFlippingToBack(supplyCard: SupplyCard) {
    this.numberOfSupplyCardsLoading += 1;
  }

  handleSupplyCardFrontVisible(supplyCard: SupplyCard) {
    this.numberOfSupplyCardsLoading -= 1;
    this.attemptToAnimateSupplyCardSort();
  }

  handleReplace(supplyCard: SupplyCard) {
    this.replacingCard = supplyCard;
  }

  private updateActiveSupplyCards() {
    if (!this.kingdom) {
      return;
    }
    if (this.kingdomId == this.kingdom.id) {
      this.updateSupplyCards();
      return;
    }
    this.kingdomId = this.kingdom.id;
    const sortedSupplyCards =
        SupplyCardSorter.sort(this.kingdom.supply.supplyCards.concat(), this.sortOption);
    
    // Remap the sorted supply cards to where the elements currently reside.
    const mappedSupplyCards = [];
    for (let i = 0; i < sortedSupplyCards.length; i++) {
      mappedSupplyCards[this.getElementIndex(i)] = sortedSupplyCards[i];
    }
    this.supplyCards = mappedSupplyCards;
  }

  private updateSupplyCards() {
    this.requiresSupplyCardSort = true;
    this.supplyCards = SortableSupplyCardsComponent.replaceSupplyCards(
        this.supplyCards, this.kingdom.supply.supplyCards);
  }

  private attemptToAnimateSupplyCardSort() {
    if (this.numberOfSupplyCardsLoading > 0 || !this.requiresSupplyCardSort) {
      return;
    }
    this.requiresSupplyCardSort = false;
    this.cancelActiveAnimations();
    this.animateSupplyCardSort();
  }

  private resetCardPositions() {
    for (let visualIndex = 0; visualIndex < this.supplyCards.length; visualIndex++) {
      const elementIndex = this.getElementIndex(visualIndex);
      const element = this.getSupplyCardElement(elementIndex);
      const startCoord = this.getPositionForElementIndex(elementIndex);
      const endCoord = this.getPositionForElementIndex(visualIndex);
      const x = endCoord.x - startCoord.x;
      const y = endCoord.y - startCoord.y;
      element.style.transform = `translate(${x}px,${y}px)`;
    }
  }

  private cancelActiveAnimations() {
    for (let animation of this.activeAnimations) {
      animation.kill();
    }
    this.activeAnimations.clear();
  }

  private animateSupplyCardSort() {
    const sortedCards = SupplyCardSorter.sort(this.supplyCards.concat(), this.sortOption);
    const descriptors = this.createMoveDescriptors(sortedCards);
    const newMapping: Map<number, number> = new Map();

    for (let descriptor of descriptors) {
      const element = this.getSupplyCardElement(descriptor.elementIndex);
      const startCoord = this.getPositionForElementIndex(descriptor.elementIndex);
      const endCoord = this.getPositionForElementIndex(descriptor.newVisualIndex);
      const x = endCoord.x - startCoord.x;
      const y = endCoord.y - startCoord.y;
      const tweenLite =
          TweenLite.to(element, ANIMATION_DURATION_SEC, {
            transform: `translate(${x}px,${y}px)`,
            ease: Sine.easeInOut,
            onComplete: () => this.activeAnimations.delete(tweenLite),
          });
      this.activeAnimations.add(tweenLite);
      newMapping.set(descriptor.newVisualIndex, descriptor.elementIndex);
    }
    this.elementIndexMapping = newMapping;
  }

  private createMoveDescriptors(sortedSupplyCards: SupplyCard[]) {
    const cardIds = this.supplyCards.map((card) => card.id);
    const descriptors: MoveDescriptor[] = [];
    for (let newVisualIndex = 0; newVisualIndex < sortedSupplyCards.length; newVisualIndex++) {
      descriptors.push({
        newVisualIndex: newVisualIndex,
        elementIndex: cardIds.indexOf(sortedSupplyCards[newVisualIndex].id),
      });
    }
    return descriptors;
  }

  private getPositionForElementIndex(index: number): Coordinate {
    const container = this.getSupplyCardContainers()[index];
    return {x: container.offsetLeft, y: container.offsetTop};
  }

  private getSupplyCardElement(index: number) {
    return this.getSupplyCardContainers()[index].firstChild! as HTMLElement;
  }

  private getSupplyCardContainers() {
    return this.$el.querySelectorAll(".grid-layout_item") as NodeListOf<HTMLElement>;
  }

  private getElementIndex(visualIndex: number) {
    return this.elementIndexMapping.has(visualIndex) 
        ? this.elementIndexMapping.get(visualIndex)!
        : visualIndex;
  }

  private static replaceSupplyCards(oldSupplyCards: SupplyCard[], newSupplyCards: SupplyCard[]) {
    const supplyCards: SupplyCard[] = [];
    const supplyCardsToAdd = SortableSupplyCardsComponent.getSupplyCardsToAdd(oldSupplyCards, newSupplyCards);
    const oldIds = SortableSupplyCardsComponent.getOldIds(oldSupplyCards, newSupplyCards);
    let supplyCardsToAddIndex = 0;
    for (let i = 0; i < oldSupplyCards.length; i++) {
      const supplyCard = oldSupplyCards[i];
      if (oldIds.has(supplyCard.id)) {
        supplyCards.push(supplyCardsToAdd[supplyCardsToAddIndex]);
        supplyCardsToAddIndex += 1;
      } else {
        supplyCards.push(supplyCard);
      }
    }
    return supplyCards;
  }

  private static getSupplyCardsToAdd(oldSupplyCards: SupplyCard[], newSupplyCards: SupplyCard[]) {
    const existingIds = new Set(oldSupplyCards.map((card) => card.id));
    return newSupplyCards.filter((card) => !existingIds.has(card.id));
  }

  private static getOldIds(oldSupplyCards: SupplyCard[], newSupplyCards: SupplyCard[]) {
    const newIds = new Set(newSupplyCards.map((card) => card.id));
    return new Set(oldSupplyCards.filter((card) => !newIds.has(card.id)).map((card) => card.id));
  }
}
Vue.component("sortable-supply-cards-component", SortableSupplyCardsComponent);
</script>

<style>
.kingdom-supply--is-enlarged .card-set-description .card-description {
  font-size: 16px !important;
}

.sortable-supply-card-copy-button {
  margin-top: 4px;
}
</style>
