import {Legend as VgLegend} from 'vega';
import {keys, stringify, vals} from '../../util';
import {Model} from '../model';
import {LegendComponent} from './component';
import {mergeLegendComponent} from './parse';

export function assembleLegends(model: Model): VgLegend[] {
  const legendComponentIndex = model.component.legends;
  const legendByDomain: {[domainHash: string]: LegendComponent[]} = {};

  for (const channel of keys(legendComponentIndex)) {
    const scaleComponent = model.getScaleComponent(channel);
    const domainHash = stringify(scaleComponent.get('domains'));
    if (legendByDomain[domainHash]) {
      for (const mergedLegendComponent of legendByDomain[domainHash]) {
        const merged = mergeLegendComponent(mergedLegendComponent, legendComponentIndex[channel]);
        if (!merged) {
          // If cannot merge, need to add this legend separately
          legendByDomain[domainHash].push(legendComponentIndex[channel]);
        }
      }
    } else {
      legendByDomain[domainHash] = [legendComponentIndex[channel].clone()];
    }
  }

  return vals(legendByDomain)
    .flat()
    .map((legendCmpt: LegendComponent) => {
      const legend = legendCmpt.combine();

      if (legend.encode && legend.encode.symbols) {
        const out = legend.encode.symbols.update;
        if (out.fill && out.fill['value'] !== 'transparent' && !out.stroke && !legend.stroke) {
          // For non color channel's legend, we need to override symbol stroke config from Vega config if stroke channel is not used.
          out.stroke = {value: 'transparent'};
        }

        if (legend.fill) {
          // If top-level fill is defined, for non color channel's legend, we need remove fill.
          delete out.fill;
        }
      }
      return legend;
    });
}
