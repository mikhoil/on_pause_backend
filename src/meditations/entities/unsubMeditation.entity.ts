import { Decimal } from '@prisma/client/runtime/library';

export class UnsubMeditation {
  readonly id: number;
  readonly title: String;
  readonly duration: Decimal;
  readonly practiceId: number;
}
