import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
    @Get('metacultivation')
    getme() {
        return 'some data';
    }
}
