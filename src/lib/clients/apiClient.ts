import client from '@/lib/clients/client';
import { suffix } from '@/config/config';

export default <T>(timeout?: number) =>
	client<T>({baseUrl: `https://api${suffix}.nomercy.tv/v1`, timeout});

