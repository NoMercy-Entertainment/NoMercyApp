import client from '@/lib/clients/client';
import { suffix } from '@/config/config';

export default (timeout?: number) =>
	client(`https://cdn${suffix}.nomercy.tv`, timeout);


