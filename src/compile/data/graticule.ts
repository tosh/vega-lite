import {GraticuleParams} from '../../data';
import {hash} from '../../util';
import {VgGraticuleTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';

export class GraticuleNode extends DataFlowNode {
  public clone() {
    return new GraticuleNode(null, this.params);
  }

  constructor(parent: DataFlowNode, private params: true | GraticuleParams) {
    super(parent);
  }

  public dependentFields() {
    return new Set();
  }

  public producedFields(): undefined {
    return undefined; // there should never be a node before graticule
  }

  public hash() {
    return `Graticule ${hash(this.params)}`;
  }

  public assemble(): VgGraticuleTransform {
    return {
      type: 'graticule',
      ...(this.params === true ? {} : this.params)
    };
  }
}
