<template>
  <div class="content Coef_scale12 card-rows " >
    <div v-for="Card in OtherCards" :key="Card.id" :class="getClassCard(Card)">
      <div class="full-card unselectable" style="z-index:0; cursor:default;
           transform: scale(1); transition:none; position: sticky;">
      <!-- is a card -->
        <!-- type of card -->
        <div class="full-card-template" :style='"background-image: url(http://71yeti.fr/img/Templates-card-type/" + getCardTypeById(Card).png + ".png);"' >
        </div>
        <!-- Basic Card Image Treasure & Victory -->
        <div class="full-card-art" :style='"background-image: url(" + Card.artwork + "); top:12%;"' >
          <div class="action-layer none-layer"> </div>
        </div>

        <div v-if="getisTreasureCard(Card)" class="treasure-production-container">
          <div class="coin-production-container">
            <div class="coin-production-left" style="top:-23px;">
              <div class="coin-production-text-container">
                <div class="coin-production-text" style="top:12px;">{{ getValueforTreasureCard(Card) }}</div>
              </div>
            </div>
            <div class="coin-production-right" style="top:-23px;">
              <div class="coin-production-text-container">
                <div class="coin-production-text" style="top:12px;">{{ getValueforTreasureCard(Card) }}</div>
              </div>
            </div>
          </div>
        </div>
        <!--Card name -->
        <div class="full-card-name-container unselectable " :style='"top:"+ getCardNameFontSize(Card).top + "px;"'>
          <div class="full-card-name card-name unselectable" :style='"font-size:" + getCardNameFontSize(Card).fontsize + "em;"'>
            {{ Card.frenchName }}</div>
        </div>
        <!--Card Text -->
        <div class="full-card-text-container" v-html="Card.text_html"></div>
         <!--Card Bottom bar -->
        <div class="bottom-bar-full" :style='"width:237.5%;bottom:" + getCardBottomBarOffset(Card) + "px;"'>
          <div class="cost-container-full">
            <div class="coin-cost-full">
              <div class="coin-cost-full-text" style="top:12px;">{{ getCostCardById(Card, "TREASURE") }}</div>
            </div>
            <div class="potion-cost-full" v-if='getCostCardById(Card,"POTION") > 0'>
            </div>
          </div>
          <div class="bottom-right-container-full">
            <div class="expansion-icon-bottom-full" :style='"background-image: url(http://71yeti.fr/img/Templates-set/"+ getCardSetById(Card) + "-small.png);"'>
            </div>
          </div>

          <div class="types-text-full unselectable" :style="getCardTypeFontSize(Card)">
            {{ getCardTypeById(Card).label }}
          </div>
        </div>
        <div class="full-card-border">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { DominionSets } from "../dominion/dominion-sets";
import { SupplyCard } from "../dominion/supply-card";
import { OtherCard } from "../dominion/other-card"
import { CardType } from "../dominion/card-type"
import { DigitalCard } from "../dominion/digital_cards/digital-cards-type"
import { OtherCards_list } from "../dominion/digital_cards/digital-cards-othercards"

export const QuestionMarkVaue =
    new Set([ "bank",
              "philosophersstone"
]);

const TREASURE = "TREASURE";
const POTION = "POTION";

interface DisplayableCardType {
    readonly png: string,
    readonly label: string
}


@Component
export default class CardOnlineOthercardPageComponent extends Vue {
  @Prop() readonly items!: any[];
  @Prop() readonly numberOfColumns!: number;
  @Prop() readonly isVertical!: boolean;
  @Prop() readonly shape!: string;

  get OtherCards() {
    return OtherCards_list;
  }
  
  isStandardCard(currentCard: DigitalCard) {
    if ((DominionSets.getCardById(currentCard.id)).constructor.name == "SupplyCard") { return true }
    return false;
  }
  
  getClassCard(currentCard: DigitalCard) {
   let globalcard = DominionSets.getCardById(currentCard.id);
    if (globalcard.constructor.name == "OtherCard") {
        return "v-for card-theme-title-dark card-theme-text-dark";
    }
    return "v-for card-theme-title-dark card-theme-text-dark";
  }
  
  getCardTypeById(currentCard: DigitalCard):DisplayableCardType {
    let globalcard = DominionSets.getCardById(currentCard.id);
    let card;
    /* here is otherCards 
    Events, Landmarks, Projetcs,
    Basic Supply Cards, Ruins, Shelters, Non-Supply, Travellers, Artefacts, Hexes
    */
    if (globalcard.constructor.name == "OtherCard") {
      card = (globalcard as OtherCard)
      if (card.isOfType(CardType.TREASURE)) { return {png: "treasure-basic", label: "Trésor"}; }
      if (card.isOfType(CardType.VICTORY)) { return {png: "victory-basic", label: "Victoire"}; }
      if (card.isOfType(CardType.TRASHING)) { return {png: "curse-basic", label: "Malédiction"}; }
    }
    if (globalcard.constructor.name == "Events") {
      return {png: "victory", label: "Victoire"};
    }
    return {png: 'error-no valid card type', label: 'error-no valid card type'};
  }
  
  getisTreasureCard(currentCard: DigitalCard) {
    let card = DominionSets.getCardById(currentCard.id);
    if (card.constructor.name == "OtherCard") {return (card as OtherCard).isOfType(CardType.TREASURE); }
    if (card.constructor.name == "SupplyCard") {return (card as SupplyCard).isOfType(CardType.TREASURE); }
    return false;
  }
  
  getValueforTreasureCard(currentCard: DigitalCard) {
    let pattern = '<div class="card-text-coin-text" style="color: black; display:inline; top:8px;">';
    if ( QuestionMarkVaue.has(currentCard.id)) { return "?"; }
    switch (currentCard.id) {
      case "copper": return 1;
      case "silver": return 2;
      case "gold": return 3;
      case "platinum": return 5;
      default : {
        let valuePosition = currentCard.text_html.indexOf(pattern)
        if (valuePosition == -1) { return "?"; }
        return currentCard.text_html.charAt(currentCard.text_html.indexOf(pattern) + pattern.length);
      }
    }
  }
  
  getCardNameFontSize(currentCard: DigitalCard) {
    let card = DominionSets.getCardById(currentCard.id);
    let isTypeTreasure=false;
    if (card.constructor.name == "OtherCard") { isTypeTreasure = (card as OtherCard).isOfType(CardType.TREASURE); }
    if (isTypeTreasure) {
      if (card.constructor.name == "OtherCard" ) { return {top: 25, fontsize:1.8}; }
      if ((currentCard.frenchName).length >=19 ) { return {top: 22, fontsize: 0.97}; }
      if ((currentCard.frenchName).length >=16 ) { return {top: 20, fontsize: 1.16}; } 
      if ((currentCard.frenchName).length >=8  ) { return {top: 18, fontsize:1.5}; } 
      return {top: 16, fontsize:1.8}; 
    }
    if (card.constructor.name == "OtherCard" ) { return {top: 24, fontsize:1.8}; }
    if ((currentCard.frenchName).length >= 25 ) { return {top: 0, fontsize: 1.1}; }
    if ((currentCard.frenchName).length >= 15 ) { return {top: 17, fontsize: 1.4}; } 
    if ((currentCard.frenchName).length >= 13 ) { return {top: 16, fontsize: 1.6}; } 
    return {top: 16, fontsize:1.8};  
  }
  
  getCardSetById(currentCard: DigitalCard) {
    return (DominionSets.getCardById(currentCard.id) as OtherCard).setId; 
  }
  
  getCardBottomBarOffset(currentCard: DigitalCard) {
    let card = DominionSets.getCardById(currentCard.id);
    if (card.constructor.name == "OtherCard") { 
      if ((card as OtherCard).isOfType(CardType.TREASURE)) { return -62; }
      if ((card as OtherCard).isOfType(CardType.VICTORY)) { return -72; }
    }
    return -70;
  }
  
  getCostCardById(currentCard: DigitalCard, costType : string) {
    let card = DominionSets.getCardById(currentCard.id);
    if (card.constructor.name == "OtherCard") { 
      if (costType == TREASURE) { 
        switch (currentCard.id) {
          case "copper": return 0;
          case "silver": return 3;
          case "potion": return 4;
          case "gold": return 6;
          case "platinum": return 9;
          case "estate" : return 2;
          case "duchy" : return 5;
          case "province" : return 8;
          case "colony" : return 11;
          default : return "?"; 
        }
      } 
      if (costType == POTION) { return 0 }
    }
     return "?";
  }
  
  getCardTypeFontSize(currentCard: DigitalCard) {
    var typeOfCard = this.getCardTypeById(currentCard).label
    if (typeOfCard.length >= 16 ) { return "font-size: 2.8em; top:35px;"; }
    if (typeOfCard.length >= 14 ) { return "font-size: 3.125em; top:30px;"; }
    return "font-size: 4.2em; top:20px;"; 
  }
  
}
</script>



