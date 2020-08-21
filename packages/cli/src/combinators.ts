import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/Array';
import { Do } from 'fp-ts-contrib/lib/Do';
import { sequenceS } from 'fp-ts/Apply';

export const traverseEither = A.array.traverse(E.either);
export const sequenceSEither = sequenceS(E.either);
export const doEither = Do(E.either);
