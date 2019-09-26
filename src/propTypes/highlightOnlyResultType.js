import warn from '../utils/warn';

export default function highlightOnlyResultType(
  props
) {
  const {allowNew, highlightOnlyResult} = props;
  warn(
    !(highlightOnlyResult && allowNew),
    '`highlightOnlyResult` will not work with `allowNew`.'
  );
}
