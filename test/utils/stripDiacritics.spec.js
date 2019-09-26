import {range} from 'lodash';

import stripDiacritics from '../../src/utils/stripDiacritics';

describe('stripDiacritics', () => {
  test('removes accents and other diacritical marks from a string', () => {
    const string = 'ÆÐƎƐŒẞæǝɛœſßĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯƳąɓçđɗęħįƙłøơşșţțŧųưƴÁÀÂÄ' +
      'ǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƐĠĜǦĞĢáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗéèėêëěĕē' +
      'ęẹġĝǧğģĤḤĦIÍÌİÎÏǏĬĪĨĮỊĴĶƘĹĻŁĽĿNŃŇÑŅÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĵķƙĸĺļ' +
      'łľŀŉńňñņóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝ' +
      'šşșṣßťţṭŧúùûüǔŭūũűůųụưẃẁŵẅýỳŷÿȳỹƴźżžẓ';

    const result = 'AEDEEOESaeeeoelsABCDDEHIKLOOSSTTTUUYabcddehikloosstttuuyA' +
      'AAAAAAAAAAAEAEAEBCCCCCDDDDDEEEEEEEEEEEEGGGGGaaaaaaaaaaaaeaeaebcccccddd' +
      'deeeeeeeeeegggggHHHIIIIIIIIIIIIJKKLLLLLNNNNNOOOOOOOOOOOOOOEhhhiiiiiiii' +
      'iiiijkkĸlllllnnnnnooooooooooooooeRRRSSSSSSSTTTTUUUUUUUUUUUUUWWWWYYYYYY' +
      'YZZZZrrrlsssssssttttuuuuuuuuuuuuuwwwwyyyyyyyzzzz';

    expect(stripDiacritics(string)).toEqual(result);
  });

  test('removes combining diacritical marks from a string', () => {
    const alphaRange = ['a', 'b', 'c', 'd', 'e', 'f'];
    const numRange = range(30, 37);

    const arr = [];

    numRange.forEach((n) => {
      alphaRange.forEach((a) => {
        arr.push(n + a);
      });
    });

    // Build up a string of every unicode combining mark (\u0300-\u036F).
    const str = arr
      .concat(range(300, 370))
      .map((n) => String.fromCharCode(`0x0${n}`))
      .join('');

    expect(str).toHaveLength(112);
    expect(stripDiacritics(str)).toEqual('');
  });
});
