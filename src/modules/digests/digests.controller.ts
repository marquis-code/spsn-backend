import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { DigestsService } from './digests.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response, Request } from 'express';
import * as https from 'https';

@Controller('digests')
export class DigestsController {
  constructor(private readonly digestsService: DigestsService) {}

  private getBaseUrl(req: Request) {
    const host = req.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() body: any, @UploadedFile() file: any, @Req() req: Request) {
    const { title, year } = body;
    const digest = await this.digestsService.create({ title, year: Number(year) }, file);
    const result = (digest as any).toObject ? (digest as any).toObject() : { ...digest };
    if (result.pdfUrl) {
      result.pdfUrl = `${this.getBaseUrl(req)}/api/digests/${result._id}/view`;
    }
    return result;
  }

  @Get()
  async findAll(@Req() req: Request) {
    const digests = await this.digestsService.findAll();
    return digests.map(d => {
      const result = (d as any).toObject ? (d as any).toObject() : { ...d };
      if (result.pdfUrl) {
        result.pdfUrl = `${this.getBaseUrl(req)}/api/digests/${result._id}/view`;
      }
      return result;
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const digest = await this.digestsService.findOne(id);
    const result = (digest as any).toObject ? (digest as any).toObject() : { ...digest };
    if (result.pdfUrl) {
      result.pdfUrl = `${this.getBaseUrl(req)}/api/digests/${result._id}/view`;
    }
    return result;
  }

  @Get(':id/view')
  async viewPdf(@Param('id') id: string, @Res() res: Response) {
    const digest = await this.digestsService.findOne(id);
    if (!digest || !digest.pdfUrl) {
      return res.status(404).send('PDF not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${digest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`);
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    // Fetch the raw PDF bytes directly from Cloudinary to bypass strict delivery ACLs
    // Cloudinary raw URLs are not blocked, so we can just pipe them directly to the client!
    https.get(digest.pdfUrl, (cloudinaryRes) => {
      cloudinaryRes.pipe(res);
    }).on('error', (e) => {
      console.error('Error fetching PDF from cloud storage:', e);
      res.status(500).send('Error loading PDF');
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: string, @Body() body: any, @UploadedFile() file: any, @Req() req: Request) {
    const digest = await this.digestsService.update(id, body, file);
    const result = (digest as any).toObject ? (digest as any).toObject() : { ...digest };
    if (result.pdfUrl) {
      result.pdfUrl = `${this.getBaseUrl(req)}/api/digests/${result._id}/view`;
    }
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.digestsService.remove(id);
  }
}
