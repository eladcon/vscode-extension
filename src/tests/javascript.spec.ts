import { getFlag } from '../javascript';
import { expect } from 'chai';
import 'mocha';

describe('Get Flag', 
  () => { 
    it('should return undefined when not rollout', () => {
      expect(getFlag('if (something.stam() {')).to.equal(undefined);
    }); 
    it('should return flag with container usage', () => {
      let res = getFlag('if (con.flag1.value() {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
      res = getFlag('if (con.flag1.isEnabled() {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
      res = getFlag('if (flag1.value() {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
      res = getFlag('if (flag1.isEnabled() {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
      res = getFlag('if (con.flag1.value({ context: {} }) {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
      res = getFlag('if (con.flag1.isEnabled({ context: {} }) {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);

      res = getFlag('if (con.flag1.value({ context: {} }) === "xxxx" {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
      res = getFlag('if (con.flag1.value() === "xxxx" {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
    }); 
    it('should return flag when dynamic api', () => {
      let res = getFlag('if (dynamic.value("flag1") {');
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(true);
      res = getFlag('if (dynamic.isEnabled("flag1") {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(true);
      res = getFlag('if (dynamic.isEnabled("flag1", { context: {} }) {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(true);
      res = getFlag('if (dynamic.isEnabled(\'flag1\', { context: {} }) {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(true);

      res = getFlag('if (dynamic.value("flag1") === "xxxxx" {')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(true);
    });
    it('should return flag with container usage', () => {
      let res = getFlag('{ flag1: new Rox.Flag(true) }')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
      res = getFlag('{ flag1: new Rox.Variant("red", ["red", "blue"])) }')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
      res = getFlag(' flag1: new Rox.Flag()')!;
      expect(res!.name).to.equal('flag1');
      expect(res!.isDynamicAPI).to.equal(false);
    });
});