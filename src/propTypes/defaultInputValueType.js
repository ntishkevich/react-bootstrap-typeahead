import warn from '../utils/warn';

export default function defaultInputValueType(props) {
  const {defaultInputValue, defaultSelected, multiple, selected} = props;
  const name = defaultSelected.length ? 'defaultSelected' : 'selected';

  warn(
    !(
      !multiple &&
      defaultInputValue &&
      (defaultSelected.length || (selected && selected.length))
    ),
    `\`defaultInputValue\` will be overridden by the value from \`${name}\`.`
  );
}
