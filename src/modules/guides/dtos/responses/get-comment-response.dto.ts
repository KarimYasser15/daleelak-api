import { Guide } from 'src/modules/user/entities/guide.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { GuideComment } from '../../entities/guide-comment.entity';

export class GetCommentResponseDto {
    id: number;
    content: string;
    createdBy: User;
    guide: Guide;
    upVotes: number;
    downVotes: number;
    createdAt: Date;

    static fromEntity(guideCommentEntity: GuideComment): GetCommentResponseDto {
        const getCommentGuideDto = new GetCommentResponseDto();
        getCommentGuideDto.id = guideCommentEntity.id;
        getCommentGuideDto.content = guideCommentEntity.content;
        getCommentGuideDto.upVotes = guideCommentEntity.upVotes;
        getCommentGuideDto.downVotes = guideCommentEntity.downVotes;
        getCommentGuideDto.guide = guideCommentEntity.guide;
        getCommentGuideDto.createdBy = guideCommentEntity.createdBy;
        getCommentGuideDto.createdAt = guideCommentEntity.createdAt;
        return getCommentGuideDto;
    }
}
