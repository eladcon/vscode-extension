const jsTokens = require('js-tokens').default;

const flagLineRegex = /isEnabled\(|value\(/;

export function getFlag(text : string = '') {
  let flagName : string | undefined = undefined;
  if (!flagLineRegex.test(text)) {
    return;
  }
  const tokens = text.match(jsTokens);
  if (!tokens) {
    return;
  }
  const isEnabledIndex = tokens.findIndex(x => x === 'isEnabled' || x === 'value');
  const afterIsEnabled = tokens.splice(isEnabledIndex + 1);
  const afterToken = afterIsEnabled.findIndex(t => t.match(/\w+/));
  if (afterToken !== -1) {
    const closeCall = afterIsEnabled.findIndex(t => t === ')');
    if (afterIsEnabled[afterToken].match(/('|"|`).*('|"|`)/) && closeCall > afterToken) {
      flagName = afterIsEnabled[afterToken].replace(/('|"|`)/g, '');
    }
  }
  if (!flagName) {
    flagName = tokens.slice(0, isEnabledIndex).reverse().find(t => t.match(/\w/g));
  }

  return flagName;
}

export function shouldHover(hoverToken : string, flagName : string) {
  return hoverToken === flagName || hoverToken === 'isEnabled' || hoverToken === 'value';
}
