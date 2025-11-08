import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Guide } from "../user/entities/guide.entity";
import { Repository } from "typeorm";
import { CreateGuideDto } from "./dtos/requests/create-guide-request.dto";
import { GetGuideResponseDto } from "./dtos/responses/get-guide-response.dto";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
import { MessageDto } from "../dtos/message.dto";

@Injectable()
export class GuideService {

    constructor(
        @InjectRepository(Guide)
        private guideRepository: Repository<Guide>,
        @InjectRepository(User)
        private userRepository: Repository<User>
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
}