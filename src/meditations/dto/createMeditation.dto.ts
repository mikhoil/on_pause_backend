export class CreateMeditationDto {
  readonly title: string;
  readonly duration: string;
  readonly practiceId: string;
  readonly forSubs?: boolean = true;
}
