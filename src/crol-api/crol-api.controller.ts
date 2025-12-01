import { Controller, Get, Param, Query } from '@nestjs/common';
import { CrolApiService } from './crol-api.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('crol-api')
@Auth()
export class CrolApiController {
  constructor(private readonly crolApiService: CrolApiService) {}

  @Get('/fromCrol/:term')
  termFromCrol(
    @Param('term') term: string,
    @Query('busqueda') busqueda: string = '',
  ) {
    let crolEndpoint: string = '/Productos/ClaveProductoSAT';

    switch (term) {
      case 'satKeys':
        crolEndpoint = '/Productos/ClaveProductoSAT';
        break;
      case 'contacts':
        crolEndpoint = '/Contactos';
        break;
      case 'serviceGroup':
        crolEndpoint = '/Productos/Agrupadores';
        break;
      case 'measure':
        crolEndpoint = '/Unidades/UnidadesMedida';
        break;
      case 'baseMeasure':
        crolEndpoint = '/Unidades/UnidadesMedidaBase';
        break;
    }

    return this.crolApiService.getFromCrol(crolEndpoint, busqueda);
  }

  @Get('/token')
  getToken() {
    return this.crolApiService.getFromDb();
  }

  @Get('/satkeys')
  getSatKeys(@Query('busqueda') busqueda: string = '') {
    return this.crolApiService.getFromCrol(
      '/Productos/ClaveProductoSAT',
      busqueda,
    );
  }

  @Get('/contacts')
  getFromCrol(@Query('busqueda') busqueda: string = '') {
    return this.crolApiService.getFromCrol('/Contactos', busqueda);
  }
}
