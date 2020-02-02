<template>
<!-- for the Landscape cards -->
  <div class="content Coef_scale12 card-rows " >
    <div v-for="Card in Cards" :key="Card.id" :class="getClassCard(Card)">

  <!--<div class="landscape-study-window" style="width:471px;height:294px;top:341px;left:378px;"> -->
    <div class="landscape unselectable" style="left:0px; top:0px; z-index:0;transform: scale(1); cursor:">
        <div class="landscape-template" :style='"background-image: url(http://71yeti.fr/img/Templates-card-type/" + getCardTypeById(Card).png + ".png);"'></div>
        <!-- type of card -->
        <div class="landscape-art" :style='"background-size: 452px 177px; background-image: url(" + Card.artwork + ")"'>
            <div class="action-layer"></div>
        </div>
        <!--Card name -->
        <div class="landscape-name-container"  :style='"top:"+ getCardNameFontSize(Card).top + "px;"'>
            <div class="landscape-name" :style='"font-size:" + getCardNameFontSize(Card).fontsize + "em;"'>
            {{ Card.frenchName }}
            </div>
        </div>
        <!---->
        <div class="landscape-cost-container-full" v-if="getCardNeedCost(Card)">
            <!---->
            <div class="landscape-debt-cost-full" v-if="getCardCost(Card).debt > 0">
              <div class="landscape-debt-cost-full-text" style="top:12px;">{{ getCardCost(Card).debt }}</div>
            </div>
            <div class="landscape-coin-cost-full" v-else >
                <div class="coin-cost-full-text" style="top:12px;">{{ getCardCost(Card).treasure }}</div>
            </div>
            <!---->
            <!---->
        </div>
		<!--Card Text -->
        <div class="landscape-text-container" v-html="Card.text_html">
        </div>
        <div class="full-card-border"></div>
        <!---->
    </div>
<!--</div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { DominionSets } from "../dominion/dominion-sets";
import { SupplyCard } from "../dominion/supply-card";
import { OtherCard } from "../dominion/other-card";
import { CardType } from "../dominion/card-type"
import { Addon } from "../dominion/addon"
import { Cost } from "../dominion/cost"
import { DigitalCard } from "../dominion/digital_cards/digital-cards-type"
import { Cards_list } from "../dominion/digital_cards/digital-cards-landscape"

export const QuestionMarkVaue =
    new Set([ "bank",
              "philosophersstone"
]);

interface DisplayableCardType {
    readonly png: string,
    readonly label: string
}


@Component
export default class CardOnlinePageComponent extends Vue {
  @Prop() readonly items!: any[];
  @Prop() readonly numberOfColumns!: number;
  @Prop() readonly isVertical!: boolean;
  @Prop() readonly shape!: string;


  get Cards() {
    return Cards_list;
  }
  
  getClassCard(currentCard: DigitalCard) {
    return "v-for-landscape card-theme-title-dark card-theme-text-dark";
  }
  
  getCardTypeById(currentCard: DigitalCard):DisplayableCardType {
    let card;
    card = DominionSets.getCardById(currentCard.id);
    if (card.constructor.name === "Event") {
       return {png: "event", label: "Event"};
    }
    if (card.constructor.name === "Project") {
       return {png: "project", label: "Event"};
    }
    if (card.constructor.name === "Landmark") {
       return {png: "landmark", label: "Landmark"};
    }
    if (card.constructor.name === "Boon") {
       return {png: "boon", label: "Boon"};
    }
    if (card.constructor.name === "OtherCard") {
      card = card as OtherCard;
      switch(card.type) { 
        case "Hexes": { return {png: "hex", label: "Hexes"};
              break; } 
       case "States": { return {png: "state", label: "States"};
              break; } 
       case "Heirlooms": { return {png: "heirloom", label: "Heirlooms"};
              break; } 
       case "Artifacts": { return {png: "artifact", label: "Artifacts"};
              break; } 
       default: { return {png: 'error-no valid card type', label: 'error-no valid card type'};
              break; } 
      }
    }
    return {png: 'error-no valid card type', label: 'error-no valid card type'};
  }
  
  getisTreasureCard(currentCard: DigitalCard) {
    let card;
    card = DominionSets.getCardById(currentCard.id);
    if (card.constructor.name == "SupplyCard") {
      card = card as SupplyCard;
      return card.isOfType(CardType.TREASURE);
    }
    if (card.constructor.name == "OtherCard") {
      return false;
    }
      return false;
  }
  
  getValueforTreasureCard(currentCard: DigitalCard) {
    let pattern = '<div class="card-text-coin-text" style="color: black; display:inline; top:8px;">';
    if ( QuestionMarkVaue.has(currentCard.id)) { return "?"; }
    let valuePosition = currentCard.text_html.indexOf(pattern)
    if (valuePosition == -1) { return "?"; }
    return currentCard.text_html.charAt(currentCard.text_html.indexOf(pattern) + pattern.length);
  }
  
  getCardNeedCost(currentCard: DigitalCard) {
    let card;
    card = DominionSets.getCardById(currentCard.id);
	console.log(currentCard.id + " :: " + card.constructor.name);
    if (card.constructor.name == "Boon" || 
        card.constructor.name == "Landmark" || 
        card.constructor.name == "OtherCard") {
      return false;
    }
    return true;
  }
  
  getCardCost(currentCard: DigitalCard) {
    let card;
    card = DominionSets.getCardById(currentCard.id);
    if (card.constructor.name == "Boon" || card.constructor.name == "OtherCard") {
      return ({treasure: 0,
            potion: 0,
            debt: 0} as Cost);
    }
    card = card as Addon
    return card.cost
  }
  
  
  getCardNameFontSize(currentCard: DigitalCard) {
    let isTreasure = this.getisTreasureCard(currentCard);
    if (isTreasure) {
      if ((currentCard.frenchName).length >=19 ) { return {top: 22, fontsize: 0.97}; } /* 17 */
      if ((currentCard.frenchName).length >=18 ) { return {top: 21, fontsize: 1.08}; } /* 18 */
      if ((currentCard.frenchName).length >=16 ) { return {top: 20, fontsize: 1.16}; } /* 16 */
      if ((currentCard.frenchName).length >=14 ) { return {top: 20, fontsize: 1.2}; } /* 16 */
      if ((currentCard.frenchName).length >=8  ) { return {top: 18, fontsize: 1.5}; } /* 11 */
                                                   return {top: 16, fontsize: 1.8}; /* >= 6 */
    }
    if ((currentCard.frenchName).length >= 20 ) { return {top: 20, fontsize: 1.1}; }
    if ((currentCard.frenchName).length >= 17 ) { return {top: 7, fontsize: 1}; } /* 17 */
    if ((currentCard.frenchName).length >= 14 ) { return {top: 6, fontsize: 1.2}; } /* 14 */
    if ((currentCard.frenchName).length >= 13 ) { return {top: 4, fontsize: 1.3}; } /* 13 */
                                                  return {top: 4, fontsize: 1.4};  /* >= 12 */
  }
  
  getCardSetById(currentCard: DigitalCard) {
    return DominionSets.getCardById(currentCard.id).setId; 
  }
  
  getCardById(currentCard: DigitalCard,) {
    return (DominionSets.getCardById(currentCard.id) as SupplyCard);
  }
  
  getCardTypeFontSize(currentCard: DigitalCard) {
    var typeOfCard = this.getCardTypeById(currentCard).label
    if (typeOfCard.length >= 16 ) { return "font-size: 2.8em;   top:35px;"; }
    if (typeOfCard.length >= 14 ) { return "font-size: 3.125em; top:30px;"; }
                                    return "font-size: 4.2em;   top:20px;"; 
  }
  
}
</script>



