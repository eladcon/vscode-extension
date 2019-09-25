import { getFlag } from '../javascript';
import { expect } from 'chai';
import 'mocha';

describe('Get Flag', 
  () => { 
    it('should return undefined when not rollout', () => {
      expect(getFlag('if (something.stam() {')).to.equal(undefined);
    }); 
    it('should return flag with container usage', () => {
      expect(getFlag('if (con.flag1.value() {')).to.equal('flag1');
      expect(getFlag('if (con.flag1.isEnabled() {')).to.equal('flag1');
      expect(getFlag('if (flag1.value() {')).to.equal('flag1');
      expect(getFlag('if (flag1.isEnabled() {')).to.equal('flag1');
      expect(getFlag('if (con.flag1.value({ context: {} }) {')).to.equal('flag1');
      expect(getFlag('if (con.flag1.isEnabled({ context: {} }) {')).to.equal('flag1');

      expect(getFlag('if (con.flag1.value({ context: {} }) === "xxxx" {')).to.equal('flag1');
      expect(getFlag('if (con.flag1.value() === "xxxx" {')).to.equal('flag1');
    }); 
    it('should return flag when dynamic api', () => {
      expect(getFlag('if (dynamic.value("flag1") {')).to.equal('flag1');
      expect(getFlag('if (dynamic.isEnabled("flag1") {')).to.equal('flag1');
      expect(getFlag('if (dynamic.isEnabled("flag1", { context: {} }) {')).to.equal('flag1');
      expect(getFlag('if (dynamic.isEnabled(\'flag1\', { context: {} }) {')).to.equal('flag1');

      expect(getFlag('if (dynamic.value("flag1") === "xxxxx" {')).to.equal('flag1');
    }); 
});