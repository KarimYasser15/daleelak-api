import { IsString } from 'class-validator';

export class CreateGuideDto {

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	location: string;

	@IsString()
	notes: string;
}
