import client from '@/lib/clients/client';
import { suffix } from '@/config/config';

export default (timeout?: number) =>
	client({baseUrl: `https://cdn${suffix}.nomercy.tv`, timeout});


