import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Post('i-liked')
  likeArticle(@Request() req) {
    return this.likeService.iLiked(req.body);
  }
}
