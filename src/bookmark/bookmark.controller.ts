import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { getUser } from "../auth/decorator";
import { createBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}
    @Get()
    getBookmarks(@getUser('id') userId: number) {}

    @Get(":id")
    getBookmarkById(@getUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {}

    @Post()
    createBookMark(@getUser('id') userId: number, @Body() dto: createBookmarkDto) {}

    @Patch()
    editBookmarkById(@getUser('id') userId: number, @Body() dto: EditBookmarkDto) {}

    @Delete(":id")
    deleteBookmarkById(@getUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {}
}
