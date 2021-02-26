import { Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path'
import * as fs from 'fs'
import { AuthGuard } from '@nestjs/passport';

@Controller('files')
export class FilesController {
    @Get('/:filename')
    getFile(@Param('filename') filename: string, @Res() res) {        
        fs.access(path.resolve('uploads', filename), fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(HttpStatus.NOT_FOUND).send()
            }

            return res.sendFile(filename, { root: 'uploads' })
        })
    }

    @Post()
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file', { storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
            cb(null, `${randomName}${file.originalname}`)
        }
    }) }))
    saveFile(@UploadedFile() file): { filename: string } {
        return { filename: file.filename }
    }
}
