import {Axis as VgAxis} from 'vega';
import {Axis, AxisPart, BaseAxisNoSignals, ConditionalAxisProp, ConditionalAxisProperty} from '../../axis';
import {FieldDefBase} from '../../channeldef';
import {duplicate, Omit} from '../../util';
import {Split} from '../split';

function isFalseOrNull(v: any) {
  return v === false || v === null;
}

export type AxisComponentProps = Omit<VgAxis, 'title' | ConditionalAxisProp> & {
  title: string | FieldDefBase<string>[];
} & {
    [k in ConditionalAxisProp]?: BaseAxisNoSignals[k] | ConditionalAxisProperty<BaseAxisNoSignals[k]>;
  };

export class AxisComponent extends Split<AxisComponentProps> {
  constructor(
    public readonly explicit: Partial<AxisComponentProps> = {},
    public readonly implicit: Partial<AxisComponentProps> = {},
    public mainExtracted = false
  ) {
    super();
  }

  public clone() {
    return new AxisComponent(duplicate(this.explicit), duplicate(this.implicit), this.mainExtracted);
  }

  public hasAxisPart(part: AxisPart) {
    // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.

    if (part === 'axis') {
      // always has the axis container part
      return true;
    }

    if (part === 'grid' || part === 'title') {
      return !!this.get(part);
    }
    // Other parts are enabled by default, so they should not be false or null.
    return !isFalseOrNull(this.get(part));
  }
}

export interface AxisComponentIndex {
  x?: AxisComponent[];
  y?: AxisComponent[];
}

export interface AxisIndex {
  x?: Axis;
  y?: Axis;
}
