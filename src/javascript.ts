import { FlagResult } from './flagResult';

const jsTokens = require('js-tokens').default;

const flagLineRegex = /isEnabled\(|getValue\(|Variant\(|Flag\(/;
const possibleTokens = ['isEnabled', 'getValue', 'Variant', 'Flag'];

export function getFlag(text : string = '') {
  let flagResult : FlagResult | undefined = undefined;
  if (!flagLineRegex.test(text)) {
    return;
  }
  const tokens = text.match(jsTokens);
  if (!tokens) {
    return;
  }
  const isEnabledIndex = tokens.findIndex(x => possibleTokens.find(t => t === x));
  const token = tokens[isEnabledIndex];
  if (token === 'isEnabled' || token === 'getValue'){
    const afterIsEnabled = tokens.splice(isEnabledIndex + 1);
    const afterToken = afterIsEnabled.findIndex(t => t.match(/\w+/));
    if (afterToken !== -1) {
      const closeCall = afterIsEnabled.findIndex(t => t === ')');
      if (afterIsEnabled[afterToken].match(/('|"|`).*('|"|`)/) && closeCall > afterToken) {
        flagResult = { name: afterIsEnabled[afterToken].replace(/('|"|`)/g, ''), isDynamicAPI: true };
      }
    }
    if (!flagResult) {
      flagResult = { name: tokens.slice(0, isEnabledIndex).reverse().find(t => t.match(/\w/g)), isDynamicAPI: false };
    }
  } else if (token === 'Variant' || token === 'Flag'){
    const afterNameIndex = tokens.slice(0, isEnabledIndex).findIndex(t => t === ':');
    if (afterNameIndex !== -1) {
      flagResult = { name: tokens.slice(0, afterNameIndex).reverse().find(t => t.match(/\w/g)), isDynamicAPI: false };
    }
  }

  return flagResult;
}

export function shouldHover(hoverToken : string, flagResult : FlagResult) {
  if (possibleTokens.find(t => t === hoverToken)) {
    return true;
  }
  return flagResult.name!.includes(hoverToken);
}
