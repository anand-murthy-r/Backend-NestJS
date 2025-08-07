import { ForbiddenException, Injectable } from '@nestjs/common';
import { createBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) {}

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId
            }
        });
    }

    async getBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId
            }
        });
        return bookmark;
    }

    async createBookMark(userId: number, dto: createBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto
            }
        });
        return bookmark;
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: { id: bookmarkId }
        });
        if (!bookmark || bookmark.id !== userId) throw new ForbiddenException("Access to resource denied");
        const updated_bookmark = await this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
                userId
            }, data: {
                ...dto
            }
        });
        return updated_bookmark;
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });
        if (!bookmark || bookmarkId !== userId) throw new ForbiddenException("Access to resource denied");
        await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        });
    }
}
