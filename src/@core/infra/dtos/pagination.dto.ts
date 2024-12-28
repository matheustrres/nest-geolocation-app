import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class DefaultPaginationOptionsQueryDto {
	@ApiProperty({
		description: 'The number of items per page',
		type: 'number',
		required: false,
	})
	@IsNumberString()
	@IsOptional()
	itemsPerPage?: number;

	@ApiProperty({
		description: 'The number of items to be taken',
		type: 'number',
		required: false,
	})
	@IsNumberString()
	@IsOptional()
	limit?: number;

	@ApiProperty({
		description: 'The number of items to be skipped',
		type: 'number',
		required: false,
	})
	@IsNumberString()
	@IsOptional()
	skip?: number;
}
