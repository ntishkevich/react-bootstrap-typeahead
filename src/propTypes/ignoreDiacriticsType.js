import warn from '../utils/warn';

export default function ignoreDiacriticsType(props) {
  const {filterBy, ignoreDiacritics} = props;
  warn(
    ignoreDiacritics || typeof filterBy !== 'function',
    'Your `filterBy` function will override the `ignoreDiacritics` prop.'
  );
}
