import { parse, ParsedMediaType } from 'content-type';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/Function';

export function wildcardMediaTypeMatch(mediaTypeA: string, mediaTypeB: string) {
  return pipe(
    O.Do,
    O.bind('a', () => parseContentType(mediaTypeA)),
    O.bind('b', () => parseContentType(mediaTypeB)),
    O.fold(
      () => false,
      ({ a, b }) => {
        return a.type === b.type && a.subtype === b.subtype;
      }
    )
  );
}

const REGEXP = /^([-\w.]+)\/(?:([-\w.]+)\+)?([-\w.]+)$/;

function parseContentType(contentType: string): O.Option<ParsedContentType> {
  return pipe(
    O.tryCatch<ParsedMediaType>(() => parse(contentType)),
    O.chain(({ type }) => {
      const match = REGEXP.exec(type.toLowerCase());

      if (!match) {
        return O.none;
      }

      const hasExtension = match.length === 4;
      return O.some({
        type: match[1],
        subtype: match[hasExtension ? 3 : 2],
        extension: hasExtension ? match[2] : undefined,
      });
    })
  );
}

interface ParsedContentType {
  type: string;
  subtype: string;
  extension?: string;
}
