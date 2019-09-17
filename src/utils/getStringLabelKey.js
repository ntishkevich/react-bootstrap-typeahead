import {DEFAULT_LABEL_KEY} from '../constants';

export default function getStringLabelKey(labelKey) {
  return typeof labelKey === 'string' ? labelKey : DEFAULT_LABEL_KEY;
}
