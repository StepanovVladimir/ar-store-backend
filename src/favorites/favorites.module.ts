import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FavoriteRepository } from 'src/common/repositories/favorite.repository';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoriteRepository]),
    AuthModule
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService]
})
export class FavoritesModule {}
