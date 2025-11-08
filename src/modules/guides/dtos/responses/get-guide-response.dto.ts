import { Guide } from 'src/modules/user/entities/guide.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class GetGuideResponseDto {
    id: number;
    title: string;
    description: string;
    location: string;
    notes: string;
    upVotes: number;
    downVotes: number;
    createdBy: User;
    createdAt: Date;

    static fromEntity(guideEntity: Guide): GetGuideResponseDto {
        const getGuideDto = new GetGuideResponseDto();
        getGuideDto.id = guideEntity.id;
        getGuideDto.title = guideEntity.title;
        getGuideDto.description = guideEntity.description;
        getGuideDto.notes = guideEntity.notes;
        getGuideDto.location = guideEntity.location;
        getGuideDto.upVotes = guideEntity.upVotes;
        getGuideDto.downVotes = guideEntity.downVotes;
        getGuideDto.createdBy = guideEntity.createdBy;
        getGuideDto.createdAt = guideEntity.createdAt;
        return getGuideDto;
    }
}
