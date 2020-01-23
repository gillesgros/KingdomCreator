import {DominionKingdom} from "./dominion-kingdom"
import {DominionSets} from "./dominion-sets"
import {SetId, IgnoreSetIdKingdoms} from "./set-id"

interface DominionContentKingdoms {
  kingdoms: any[];
}

declare global {
  interface Window {
    DominionKingdoms: {[key in SetId]: DominionContentKingdoms};
  }
}

export class DominionKingdoms {

  static readonly kingdoms:{[key in SetId]?: DominionKingdom[]} = DominionKingdoms.createKingdoms();

  private static createKingdoms() {
    const setIds = Object.keys(window.DominionKingdoms) as SetId[];
    const sets: {[key in SetId]?: DominionKingdom[]} = {};
    for (let setId of setIds) {
      const kingdoms = window.DominionKingdoms[setId].kingdoms;
      sets[setId] = kingdoms.map((json: any) => DominionKingdom.fromJson(json));
    }
    return sets;
  }
  
  public static getAllKingdoms(): DominionKingdom[] {
    var Kingdoms:DominionKingdom[]= []
    var setIds = Object.keys(DominionSets.sets)
						.filter(
							function(value, index, arr) {
								return !IgnoreSetIdKingdoms.has((value as SetId));
							}
						);

    for (let setId of setIds) {
		Kingdoms = Kingdoms.concat((DominionKingdoms.kingdoms[setId as SetId] as DominionKingdom[]))
							.filter((kingdom, index, self) => index === self.findIndex((t) => (t.name === kingdom.name)))
    }
    return Kingdoms;
  }
}
