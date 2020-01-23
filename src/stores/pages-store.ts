import Vue from "vue";
import Vuex from "vuex";
import { SetId } from "../dominion/set-id";
import { windowStore, State as WindowStoreState } from "./window/window-store";
import { randomizerStore, State as RandomizerState } from "./randomizer/randomizer-store";

Vue.use(Vuex);

export interface State {
  selectedSetId: SetId;
  selectedKDSetId: SetId;
  selectedLang: string;
  window: WindowStoreState;
  randomizer: RandomizerState;
}

export const store = new Vuex.Store({
  state: {
    selectedSetId: SetId.BASE_SET,
    selectedKDSetId: SetId.BASE_SET,
    selectedLang : ""
  } as State,
  mutations: {
    UPDATE_SELECTED_SET (state: State, setId: SetId) {
      state.selectedSetId = setId;
    },
    UPDATE_SELECTED_KDSET (state: State, setId: SetId) {
      state.selectedKDSetId = setId;
    },
    UPDATE_SELECTED_LANG (state: State, lang: string) {
      state.selectedLang = lang;
    }
  },
  modules: {
    randomizer: randomizerStore,
    window: windowStore,
  }
});
