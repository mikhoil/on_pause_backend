export class CreateMeditationDto {
  readonly title: string;
  readonly duration: number;
  readonly practiceId: number;
  readonly forSubs?: boolean = true;
  readonly url: string;
}
