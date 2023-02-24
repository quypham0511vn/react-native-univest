import { AuthServices } from './auth-services';
import { CommonServices } from './common-services';
import { AssetsServices } from './assets-services';
import { PaymentServices } from './payment-service';
import { ImageServices } from './image-services';
import { TransactionServices } from './transaction-service';
import { NotifyServices } from './notify-services';

export class ApiServices {

    auth = new AuthServices();

    common = new CommonServices();

    assets = new AssetsServices();

    payment = new PaymentServices();

    transaction = new TransactionServices();

    image = new ImageServices();

    notify = new NotifyServices();
}
