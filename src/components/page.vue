<template>
  <div>
    <div class="condensed-menu" v-if="isCondensed">
      <ul class="condensed-menu_items">
        <li class="condensed-menu_item" v-for="menuItem in menuItems"
          :class="{active: isMenuItemActive(menuItem)}"
          :key="menuItem.url"
        >
          <a class="condensed-menu_item_link" :href="menuItem.url">{{ menuItem.title }}</a>
        </li>
      </ul>
    </div>
    <a id="TopofThePage" />
    <div class="page" :class="{'show-condensed-menu': shouldShowCondensedMenu}">
      <header>
        <div class="title-container">
          <h1 class="title">
            <a class="title_link" href="/index.html">Dominion Randomizer</a>
          </h1>
          <h2 class="tagline">{{ subtitle }}</h2>
            <select v-model="selectedLanguage">
              <option v-for="locale in locales" v-bind:value="locale.id">{{ locale.name }}</option>
            </select>
        </div>
        <div class="condensed-menu-button" v-if="isCondensed" @click="handleMenuClick"></div>
        <div class="menu" v-if="!isCondensed">
          <ul class="menu_items">
            <li class="menu_item" v-for="menuItem in menuItems"
                :class="{active: isMenuItemActive(menuItem)}" :key="menuItem.title">
              <a class="menu_item_link" :href="menuItem.url">{{ menuItem.title }}</a>
            </li>
          </ul>
        </div>
      </header>
      <div v-for="lang in [ selectedLanguage ]" :key="lang">
        <slot></slot>
      </div>
      <footer>
        <div class="github-info">
          Source is on <a href="https://github.com/blakevanlan/KingdomCreator">Github</a>.
          Feature requests and complaints go <a href="https://github.com/blakevanlan/KingdomCreator/issues">here</a>!
        </div>
        <div class="disclaimers-and-credit">
          Dominion is by Donald X. Vaccarino and published by Rio Grande Games.
          This site has no affiliation with either party.
          Card images are provided by <a href="http://wiki.dominionstrategy.com/index.php/Main_Page">Dominion Strategy Wiki</a>.

          Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">
          Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
          and is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>.
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Getter } from "vuex-class";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Vue2Storage } from "vue2-storage";
import { UPDATE_SELECTED_LANG } from "../stores/pages-store-mutation-types";
import { State } from "../stores/pages-store";

Vue.use(Vue2Storage, {
  prefix: 'KingdomCreator_',
  driver: 'local'
});

export enum MenuItemType {
  CARDS,
  RANDOMIZER,
  KINGDOMS,
  SETS,
  RULES,
};

class MenuItem {
  constructor(readonly type: MenuItemType, readonly title: string, readonly url: string) {
  }
};

const MENU_ITEMS = [
  new MenuItem(MenuItemType.CARDS, "Card", "/card.html"),
  new MenuItem(MenuItemType.RANDOMIZER, "Randomizer", "/index.html"),
  new MenuItem(MenuItemType.KINGDOMS, "Recommended Kingdoms", "/kingdoms.html"),
  new MenuItem(MenuItemType.SETS, "Sets", "/sets.html"),
  new MenuItem(MenuItemType.RULES, "Rules", "/rules.html"),
];

@Component
export default class PageComponent extends Vue {
  @Prop() readonly subtitle!: string;
  @Prop() readonly selectedType!: MenuItemType;
  @Getter("isCondensed") readonly isCondensed!: boolean;
  isCondensedMenuActive = false;
  menuItems = MENU_ITEMS;
  locales= [
    {id: '', name: 'English'}, 
    {id: '.fr', name: 'Francais'}
  ];
  beforeMount() {
    if (this.$storage.has("Language")) {
      if (!((this.$store.state as State).selectedLang === this.$storage.get("Language")))  {
       this.$store.commit(UPDATE_SELECTED_LANG, this.$storage.get("Language"));
      }
    } else {
      this.$storage.set("Language", (this.$store.state as State).selectedLang);
    }
  }

  get shouldShowCondensedMenu() {
    return this.isCondensed && this.isCondensedMenuActive;
  }

  handleMenuClick() {
    this.isCondensedMenuActive = !this.isCondensedMenuActive;
  }

  isMenuItemActive(menuItem: MenuItem) {
    return menuItem.type == this.selectedType;
  }

  get selectedLanguage() {
  console.log("selectedLanguage= "+ (this.$store.state as State).selectedLang);
   	return (this.$store.state as State).selectedLang;
  }

  set selectedLanguage(value: string) {
  console.log("set lang");
    this.$storage.set("Language", value);
    this.$store.commit(UPDATE_SELECTED_LANG, value);
  }
  
};

</script>