import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Guide } from "../user/entities/guide.entity";
import { Repository } from "typeorm";
import { CreateGuideDto } from "./dtos/requests/create-guide-request.dto";
import { GetGuideResponseDto } from "./dtos/responses/get-guide-response.dto";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
import { MessageDto } from "../dtos/message.dto";
import { GuideComment } from "./entities/guide-comment.entity";
import { CreateCommentDto } from "./dtos/requests/create-comment-request.dto";
import { GetCommentResponseDto } from "./dtos/responses/get-comment-response.dto";

@Injectable()
export class GuideService {

    constructor(
        @InjectRepository(Guide)
        private guideRepository: Repository<Guide>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(GuideComment)
        private guideCommentRepository: Repository<GuideComment>
    ) { }


    public async createGuide(userPayload: JwtPayload, userId: number, createGuideDto: CreateGuideDto): Promise<GetGuideResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = this.guideRepository.create({ ...createGuideDto, createdBy: user, });
        const savedEvent = await this.guideRepository.save(guide);
        return GetGuideResponseDto.fromEntity(savedEvent);
    }
    public async getGuideById(userPayload: JwtPayload, userId: number, guideId: number): Promise<GetGuideResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId }, relations: ["createdBy"], });
        if (!guide) {
            throw new NotFoundException("Guide not found");
        }
        return guide;
    }
    public async getAllGuides(userPayload: JwtPayload, userId: number): Promise<GetGuideResponseDto[]> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guides = await this.guideRepository.find({
            order: { id: "DESC" },
        });

        if (!guides.length) {
            throw new NotFoundException("No guides found");
        }
        return guides.map((guide) => GetGuideResponseDto.fromEntity(guide));
    }
    public async deleteGuide(userPayload: JwtPayload, userId: number, guideId: number): Promise<MessageDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });

        if (!guide) {
            throw new NotFoundException("Guide Not Found");
        }
        await this.guideRepository.remove(guide);
        return {
            message: "Guide Deleted"
        };
    }
    public async upVoteGuide(userPayload: JwtPayload, userId: number, guideId: number): Promise<GetGuideResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });

        if (!guide) {
            throw new NotFoundException("Guide Not Found");
        }
        guide.upVotes = guide.upVotes + 1;
        const updatedGuide = await this.guideRepository.save(guide);
        return GetGuideResponseDto.fromEntity(updatedGuide);
    }
    public async downVoteGuide(userPayload: JwtPayload, userId: number, guideId: number): Promise<GetGuideResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });

        if (!guide) {
            throw new NotFoundException("Guide Not Found");
        }
        guide.downVotes = guide.downVotes - 1;
        const updatedGuide = await this.guideRepository.save(guide);
        return GetGuideResponseDto.fromEntity(updatedGuide);
    }
    public async createComment(userPayload: JwtPayload, userId: number, guideId: number, createCommentDto: CreateCommentDto): Promise<MessageDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });
        if (!guide) {
            throw new NotFoundException("Guide Not Found");
        }
        const comment = await this.guideCommentRepository.create({ ...createCommentDto, guide, createdBy: user });
        await this.guideCommentRepository.save(comment);
        return {
            message: "Comment Posted"
        };
    }
    public async getAllComments(userPayload: JwtPayload, userId: number, guideId: number): Promise<GetCommentResponseDto[]> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });
        if (!guide) {
            throw new NotFoundException("Guide Not Found");
        }
        const comments = await this.guideCommentRepository.find({
            where: { guide: { id: guideId } },
            relations: ['createdBy'],
            order: { createdAt: 'DESC' },
        });
        return comments;
    }
    public async deleteComment(userPayload: JwtPayload, userId: number, guideId: number, commentId: number): Promise<MessageDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });
        if (!guide) {
            throw new NotFoundException("Guide Not Found");
        }
        const comment = await this.guideCommentRepository.findOne({
            where: { id: commentId },
            relations: ["createdBy", "guide"],
        });
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }
        if (comment.guide.id !== guide.id) {
            throw new UnauthorizedException("This comment does not belong to the specified guide");
        }
        if (comment.createdBy.id !== user.id) {
            throw new UnauthorizedException("You can only delete your own comments");
        }
        await this.guideCommentRepository.remove(comment);
        return {
            message: "Comment Deleted"
        };
    }
    public async upVoteComment(userPayload: JwtPayload, userId: number, guideId: number, commentId: number): Promise<GetCommentResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });
        if (!guide) {
            throw new NotFoundException("Guide Not Found");
        }
        const comment = await this.guideCommentRepository.findOne({
            where: { id: commentId },
            relations: ["createdBy", "guide"],
        });
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }
        if (comment.guide.id !== guide.id) {
            throw new UnauthorizedException("This comment does not belong to the specified guide");
        }
        comment.upVotes = comment.upVotes + 1;
        const updatedComment = await this.guideCommentRepository.save(comment);
        return GetCommentResponseDto.fromEntity(updatedComment);

    }
    public async downVoteComment(userPayload: JwtPayload, userId: number, guideId: number, commentId: number): Promise<GetCommentResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const guide = await this.guideRepository.findOne({ where: { id: guideId } });
        if (!guide) {
            throw new NotFoundException("Guide Not Found");
        }
        const comment = await this.guideCommentRepository.findOne({
            where: { id: commentId },
            relations: ["createdBy", "guide"],
        });
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }
        if (comment.guide.id !== guide.id) {
            throw new UnauthorizedException("This comment does not belong to the specified guide");
        }
        comment.downVotes = comment.downVotes - 1;
        const updatedComment = await this.guideCommentRepository.save(comment);
        return GetCommentResponseDto.fromEntity(updatedComment);

    }
}