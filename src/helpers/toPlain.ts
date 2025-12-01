import { User } from 'src/users/entities/user.entity';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { Resource } from 'src/resources/entities/resource.entity';

function getSellerName(seller: User): string {
  const sellerEntity = seller as unknown as User;

  return sellerEntity.name + ' ' + sellerEntity.surname;
}

function resourcesToPlain(resources: Resource[]): any[] {
  return resources
    .filter((res) => res.isActive)
    .map(({ sku, notes, isActive, ...data }) => {
      let supplierName: string | undefined = undefined;
      if (data.supplier) supplierName = data.supplier.name;

      let userName: string | undefined = undefined;
      if (data.user) userName = `${data.user.name} ${data.user.surname}`;

      return { supplierName, userName, ...data };
    });
}

function proyectToPlain(proyect: Proyect) {
  let resources: any[] = [];
  let seller: string | undefined = undefined;

  if (proyect.resources?.length)
    resources = resourcesToPlain(proyect.resources);

  if (proyect.seller) seller = getSellerName(proyect.seller);

  return {
    ...proyect,
    seller,
    resources,
  };
}

export { getSellerName, resourcesToPlain, proyectToPlain };
