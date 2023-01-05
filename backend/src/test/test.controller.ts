import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
    @Get('metacultivation')
    getme() {
        console.log("METACULTIVATION")
        return 'metacultivation page';
    }
}
