// Must match popup.js
const READ_LOGS_REQUEST = "CatanExtenstionPopupReadLogsRequest";

// Game log element ID from colonist.io (Subject to change).
const GAME_LOG_ID = "game-log-text";

const asAltText = (key) => `alt="${key}"`;

// Resource image alt tags from colonist.io (Subject to change).
const BRICK_KEY = "brick"
const brickRegex = /alt="brick"/g;
const GRAIN_KEY = "grain"
const grainRegex = /alt="grain"/g;
const LUMBER_KEY = "lumber";
const lumberRegex = /alt="lumber"/g;
const ORE_KEY = "ore";
const oreRegex = /alt="ore"/g;
const WOOL_KEY = "wool";
const woolRegex = /alt="wool"/g;
const UKNOWN_KEY = "card";
const unknownRegex = /alt="card"/g;

// Purchases image alt tags from colonist.io (subject to change).
const CITY_KEY = "city";
const DEVELOPMENT_KEY = "development card";
const ROAD_KEY = "road";
const SETTLEMENT_KEY = "settlement";

// Action names defined for the extenstion.
// The regexes are subject to change. The action names are only included for debugging purposes.
const STARTING_RESOURCES_ACTION = "starting";
const startingResourcesRegex = /(\w+) received starting resources/;
const HARVEST_RESOURCES_ACTION = "harvest";
const DISCARD_RESOURCES_ACTION = "discard";
const BUY_CITY_ACTION = "buy_city";
const BUY_DEVELOPMENT_ACTION = "buy_development";
const BUY_ROAD_ACTION = "buy_road";
const BUY_SETTLEMENT_ACTION = "buy_settlement";
const TRADE_ACTION = "trade";
const STEAL_ACTION = "steal";

function parseAction(innerHTML) {
  if (startingResourcesRegex.test(innerHTML)) {
    const match = startingResourcesRegex.exec(innerHTML);
    // Return an array because trades/steals will exist as 2 actions
    return [{
      action: STARTING_RESOURCES_ACTION,
      player: match[1],
      resources: {
        [BRICK_KEY]: (innerHTML.match(brickRegex) || []).length,
        [GRAIN_KEY]: (innerHTML.match(grainRegex) || []).length,
        [LUMBER_KEY]: (innerHTML.match(lumberRegex) || []).length,
        [ORE_KEY]: (innerHTML.match(oreRegex) || []).length,
        [WOOL_KEY]: (innerHTML.match(woolRegex) || []).length,
      }
    }];
  }
  return [];
};


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message !== READ_LOGS_REQUEST) return false;

    const logsContainer = document.getElementById(GAME_LOG_ID);
    if (!!logsContainer) {
      sendResponse({
        success: true,
        data: Array.from(logsContainer.children).reduce(
            (actions, child) => {
              return actions.concat(parseAction(child.innerHTML))
            },[]),
      });
    } else {
      sendResponse({
        success: false,
        error: "Could not find logs container",
      });
    }
    // Required for response to be used in callback.
    return true;
  }
);