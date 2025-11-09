import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { GuideService } from "./guide.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../../decorators/current-user";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
import { CreateGuideDto } from "./dtos/requests/create-guide-request.dto";
import { GetGuideResponseDto } from "./dtos/responses/get-guide-response.dto";
import { MessageDto } from "../dtos/message.dto";
import { CreateCommentDto } from "./dtos/requests/create-comment-request.dto";
import { GetCommentResponseDto } from "./dtos/responses/get-comment-response.dto";

@Controller('/user/:userId/guide/')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GuideController {
    constructor(private readonly guideService: GuideService) { }

    @Post('')
    public async createGuide(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Body() createGuideDto: CreateGuideDto): Promise<GetGuideResponseDto> {
        return this.guideService.createGuide(userPayload, userId, createGuideDto);
    }

    @Get('/:guideId')
    public async getGuideById(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number): Promise<GetGuideResponseDto> {
        return this.guideService.getGuideById(userPayload, userId, guideId);
    }

    @Get('')
    public async getAllGuides(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number): Promise<GetGuideResponseDto[]> {
        return this.guideService.getAllGuides(userPayload, userId);
    }

    @Delete('/:guideId')
    public async deleteGuide(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number): Promise<MessageDto> {
        return this.guideService.deleteGuide(userPayload, userId, guideId);
    }

    @Patch('/:guideId/upVote')
    public async upVoteGuide(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number): Promise<GetGuideResponseDto> {
        return this.guideService.upVoteGuide(userPayload, userId, guideId);
    }

    @Patch('/:guideId/downVote')
    public async downVoteGuide(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number): Promise<GetGuideResponseDto> {
        return this.guideService.downVoteGuide(userPayload, userId, guideId);
    }

    @Post('/:guideId/comment')
    public async createComment(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number, @Body() createCommnetDto: CreateCommentDto): Promise<MessageDto> {
        return this.guideService.createComment(userPayload, userId, guideId, createCommnetDto);
    }

    @Get('/:guideId/comment')
    public async getComment(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number): Promise<GetCommentResponseDto[]> {
        return this.guideService.getAllComments(userPayload, userId, guideId);
    }

    @Delete('/:guideId/comment/:commentId')
    public async deleteComment(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<MessageDto> {
        return this.guideService.deleteComment(userPayload, userId, guideId, commentId);
    }

    @Patch('/:guideId/comment/:commentId/upVote')
    public async upVoteComment(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<GetCommentResponseDto> {
        return this.guideService.upVoteComment(userPayload, userId, guideId, commentId);
    }

    @Patch('/:guideId/comment/:commentId/downVote')
    public async downVoteComment(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('guideId', ParseIntPipe) guideId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<GetCommentResponseDto> {
        return this.guideService.downVoteComment(userPayload, userId, guideId, commentId);
    }
}