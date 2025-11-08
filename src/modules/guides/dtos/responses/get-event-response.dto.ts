import { Guide } from 'src/modules/user/entities/guide.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class GetGuideResponseDto {
    title: string;
    description: string;
    location: string;
    notes: string;
    createdBy: User;
    createdAt: Date;

    static fromEntity(guideEntity: Guide): GetGuideResponseDto {
        const getGuideDto = new GetGuideResponseDto();
        getGuideDto.title = guideEntity.title;
        getGuideDto.description = guideEntity.description;
        getGuideDto.notes = guideEntity.notes;
        getGuideDto.location = guideEntity.location;
        getGuideDto.createdBy = guideEntity.createdBy;
        getGuideDto.createdAt = guideEntity.createdAt;
        return getGuideDto;
    }
}
