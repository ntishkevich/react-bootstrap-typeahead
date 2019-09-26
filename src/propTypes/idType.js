import warn from '../utils/warn';

export default function idType(props) {
  const {id, menuId} = props;

  warn(
    menuId == null,
    'The `menuId` prop is deprecated. Use `id` instead.'
  );

  warn(
    id != null,
    'The `id` prop will be required in future versions to make the component ' +
    'accessible for users of assistive technologies such as screen readers.'
  );
}
