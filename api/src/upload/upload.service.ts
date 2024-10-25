import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

interface UploadProfileImgBB {
  email: string;
  imageOptions: {
    addImageUrl: string;
    deleteImageUrl: string;
  };
}
@Injectable()
export class uploadService {
  constructor(private userManager: UserService) {}

  async uploadProfilePicture(data: UploadProfileImgBB): Promise<any> {
    console.log(data.imageOptions);
    const user = await this.userManager.find_user(data.email);
    if (!user && !data.imageOptions.addImageUrl) {
      throw new UnauthorizedException('A tentativa de upload falhou!');
    }
    if (data.imageOptions.addImageUrl && data.imageOptions.deleteImageUrl) {
      user.imageOptions = {
        addImageUrl: data.imageOptions.addImageUrl,
        deleteImageUrl: data.imageOptions.deleteImageUrl,
      };
      await user.save();
      return user;
    }
  }
}
