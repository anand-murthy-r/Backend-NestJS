import { Injectable } from '@nestjs/common';
import { createBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {

    getBookmarks(userId: number) {}

    getBookmarkById(userId: number, bookmarkId: number) {}

    createBookMark(userId: number, dto: createBookmarkDto) {}

    editBookmarkById(userId: number, dto: EditBookmarkDto) {}

    deleteBookmarkById(userId: number, bookmarkId: number) {}
}
