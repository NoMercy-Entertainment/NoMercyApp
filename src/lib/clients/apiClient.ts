import client from '@/lib/clients/client';
import {suffix} from '@/config/config';

export default <T>(timeout?: number) =>
	client<T>(`https://api${suffix}.nomercy.tv/v1`, timeout);

